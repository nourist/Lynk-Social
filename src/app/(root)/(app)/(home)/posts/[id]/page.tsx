'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useRef } from 'react';
import useSWR from 'swr';

import PostComments from './post-comments';
import { PostCard, PostSkeleton } from '~/components/post-list';
import { Button } from '~/components/ui/button';
import { getPostById } from '~/services/post';

type PostIdPageProps = {
	params: Promise<{ id: string }>;
};

const PostIdPage = ({ params }: PostIdPageProps) => {
	const { id } = use(params);
	const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

	const { data: post, isLoading, error } = useSWR(`post-${id}`, () => getPostById(id));

	if (error) {
		throw error;
	}

	if (isLoading) {
		return <PostSkeleton />;
	}

	if (post === null) {
		return notFound();
	}

	if (!post) {
		return null;
	}

	const focusCommentInput = () => {
		commentInputRef.current?.focus();
		commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	return (
		<div className="space-y-4 xl:mx-8">
			<div>
				<Button asChild variant="ghost" size="sm" className="-ml-2">
					<Link href="/">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Link>
				</Button>
			</div>

			<PostCard post={post} onCommentClick={focusCommentInput} />

			<PostComments postId={id} textareaRef={commentInputRef} />
		</div>
	);
};

export default PostIdPage;
