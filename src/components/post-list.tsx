'use client';

import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import InfiniteScroll from '~/components/infinity-scroll';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import UserAvatar from '~/components/user-avatar';
import { PostItem, PostListResponse, type getExplorePosts, getHomePosts, isPostLiked, toggleLikePost } from '~/services/blog';

interface Props {
	fetcher: ({ limit, offset }: { limit: number; offset: number }) => ReturnType<typeof getHomePosts | typeof getExplorePosts>;
}

interface PostCardProps {
	post: PostItem;
}

const PostCard = ({ post }: PostCardProps) => {
	const router = useRouter();
	const [isLiked, setIsLiked] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		isPostLiked(post.id)
			.then(setIsLiked)
			.catch(() => {
				// Silently fail if user is not authenticated
			})
			.finally(() => setIsLoading(false));
	}, [post.id]);

	const handleLike = async () => {
		try {
			const result = await toggleLikePost(post.id);
			setIsLiked(result.liked);
		} catch {
			toast.error('Không thể thực hiện thao tác like');
		}
	};

	const handleComment = () => {
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
					<Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading} className={isLiked ? 'text-red-500 hover:text-red-600' : ''}>
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

const PostList = ({ fetcher }: Props) => {
	const [offset, setOffset] = useState(0);
	const [data, setData] = useState<PostListResponse>({
		count: 0,
		data: [],
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isLoading) return;
		setIsLoading(true);
		fetcher({ limit: 20, offset })
			.then((res) => {
				setData((prev) => ({
					count: res.count,
					data: [...prev.data, ...res.data],
				}));
			})
			.finally(() => setIsLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [offset]);

	return (
		<InfiniteScroll
			hasMore={(data.count ?? 0) > offset + 20}
			loadMore={() => {
				setOffset((prev: number) => prev + 20);
			}}
		>
			<div className="flex flex-col gap-6">
				{data.data.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</InfiniteScroll>
	);
};

export default PostList;
