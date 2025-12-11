'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import PostComments from './post-comments';
import { PostCard } from '~/components/post-list';
import { Button } from '~/components/ui/button';
import { PostItem } from '~/services/post';

interface PostDetailProps {
	post: PostItem;
}

const PostDetail = ({ post: initialPost }: PostDetailProps) => {
	const router = useRouter();
	const [post] = useState(initialPost);
	const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

	const focusCommentInput = () => {
		commentInputRef.current?.focus();
		commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	return (
		<div className="space-y-4 xl:mx-8">
			<div>
				<Button variant="ghost" size="sm" className="-ml-2" onClick={() => router.back()}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
			</div>

			<PostCard post={post} onCommentClick={focusCommentInput} />

			<PostComments postId={post.id} textareaRef={commentInputRef} />
		</div>
	);
};

export default PostDetail;
