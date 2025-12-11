'use client';

import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import InfiniteScroll from '~/components/infinity-scroll';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import UserAvatar from '~/components/user-avatar';
import { PostItem, type getExplorePosts, getHomePosts, toggleLikePost } from '~/services/post';

type PostFetcher = ({ limit, offset }: { limit: number; offset: number }) => ReturnType<typeof getHomePosts | typeof getExplorePosts>;

interface Props {
	fetcher: PostFetcher;
	type: string;
}

interface PostCardProps {
	post: PostItem;
	onCommentClick?: () => void;
}

interface PostPageProps {
	fetcher: PostFetcher;
	offset: number;
	type: string;
}

const PostCard = ({ post, onCommentClick }: PostCardProps) => {
	const router = useRouter();
	const [isLiked, setIsLiked] = useState(post.isLiked);

	const handleLike = async () => {
		try {
			setIsLiked((prev) => !prev);
			await toggleLikePost(post.id);
		} catch {
			toast.error('Error while liking the post');
			setIsLiked((prev) => !prev);
		}
	};

	const handleComment = () => {
		if (onCommentClick) {
			onCommentClick();
			return;
		}

		router.push(`/posts/${post.id}`);
	};

	return (
		<Card>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-3">
					<Link href={`/users/${post.author.id}`}>
						<UserAvatar className="size-10" user={post.author} />
					</Link>
					<div className="flex-1">
						<Link href={`/users/${post.author.id}`} className="leading-tight font-semibold hover:underline">
							{post.author.name}
						</Link>
						<div className="text-muted-foreground text-xs">
							{new Date(post.created_at).toLocaleString(undefined, {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</div>
					</div>
				</div>

				<div className="space-y-1">
					<div className="text-base font-semibold">{post.title}</div>
					{post.content && <p className="text-muted-foreground wrap-break-words text-sm whitespace-pre-line">{post.content}</p>}
				</div>

				{post.image && (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={post.image} alt={post.title} className="max-h-96 w-full rounded-md object-cover" />
				)}

				{post.video && (
					<video controls className="max-h-96 w-full rounded-md">
						<source src={post.video} />
					</video>
				)}

				<div className="flex items-center gap-2 border-t pt-4">
					<Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? 'text-red-500 hover:text-red-600' : ''}>
						<Heart className={isLiked ? 'fill-current' : ''} />
						Like
					</Button>
					<Button variant="ghost" size="sm" onClick={handleComment}>
						<MessageCircle />
						Comment
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export const PostSkeleton = () => (
	<Card className="animate-pulse">
		<CardContent className="space-y-3">
			<div className="flex items-center gap-3">
				<div className="bg-muted size-10 rounded-full" />
				<div className="flex-1 space-y-1">
					<div className="bg-muted h-4 w-24 rounded" />
					<div className="bg-muted h-3 w-40 rounded" />
				</div>
			</div>

			<div className="space-y-1">
				<div className="bg-muted h-5 w-3/5 rounded" />
				<div className="bg-muted h-4 w-full rounded" />
				<div className="bg-muted h-4 w-4/5 rounded" />
			</div>

			<div className="bg-muted h-60 w-full rounded-md" />

			<div className="flex items-center gap-2 border-t pt-4">
				<div className="bg-muted h-8 w-20 rounded" />
				<div className="bg-muted h-8 w-28 rounded" />
			</div>
		</CardContent>
	</Card>
);

const PostPage = ({ fetcher, offset, type }: PostPageProps) => {
	const { data, isLoading, error } = useSWR(`${type}-posts-${offset}`, () => fetcher({ limit: 20, offset }));

	if (error) {
		throw error;
	}

	if (isLoading) {
		return <PostSkeleton />;
	}

	return (
		<>
			{data?.data.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</>
	);
};

const PostList = ({ fetcher, type }: Props) => {
	const [cnt, setCnt] = useState(1);

	const { data, isLoading, error } = useSWR(`${type}-posts-0`, () => fetcher({ limit: 20, offset: 0 }));

	if (error) {
		throw error;
	}

	if (isLoading) {
		return <PostSkeleton />;
	}

	return (
		<InfiniteScroll
			hasMore={(data?.count ?? 0) > cnt * 20}
			loadMore={() => {
				setCnt((prev: number) => prev + 1);
			}}
		>
			{Array.from({ length: cnt }, (_, i) => (
				<PostPage type={type} fetcher={fetcher} offset={i * 20} key={i} />
			))}
		</InfiniteScroll>
	);
};

export default PostList;
export { PostCard };
