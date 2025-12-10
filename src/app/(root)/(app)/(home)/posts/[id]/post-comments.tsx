'use client';

import { Heart, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import useSWR from 'swr';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Textarea } from '~/components/ui/textarea';
import UserAvatar from '~/components/user-avatar';
import { createComment, getCommentsByPostId, toggleLikeComment } from '~/services/comment';

type TextareaRef = React.RefObject<HTMLTextAreaElement | null> | React.MutableRefObject<HTMLTextAreaElement | null>;

type PostCommentsProps = {
	postId: string;
	textareaRef?: TextareaRef;
};

const PostComments = ({ postId, textareaRef }: PostCommentsProps) => {
	const internalRef = useRef<HTMLTextAreaElement | null>(null);
	const commentRef = textareaRef ?? internalRef;
	const [comment, setComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [likingId, setLikingId] = useState<string | null>(null);

	const { data: comments, isLoading, error, mutate } = useSWR(`post-${postId}-comments`, () => getCommentsByPostId(postId));

	if (error) {
		throw error;
	}

	const focusCommentInput = () => {
		commentRef.current?.focus();
		commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	const handleSubmit = async () => {
		const content = comment.trim();

		if (!content) {
			focusCommentInput();
			return;
		}

		setIsSubmitting(true);

		try {
			await createComment({ postId, content });
			setComment('');
			await mutate();
		} catch (err) {
			// keep silent here; caller page can handle toasts if needed
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleToggleLike = async (commentId: string) => {
		if (!comments) return;

		const optimistic = comments.map((c) => (c.id === commentId ? { ...c, isLiked: !c.isLiked, likesCount: c.likesCount + (c.isLiked ? -1 : 1) } : c));

		await mutate(optimistic, false);

		setLikingId(commentId);
		try {
			await toggleLikeComment(commentId);
			await mutate();
		} catch (err) {
			console.error(err);
			// fallback revalidation to correct state if error
			await mutate();
		} finally {
			setLikingId(null);
		}
	};

	return (
		<Card>
			<CardContent className="space-y-4">
				<div className="border-input focus-within:ring-ring/50 bg-background/40 focus-within:border-ring flex flex-col gap-2 rounded-lg border px-3 pt-2 pb-3 shadow-sm transition focus-within:ring-2">
					<Textarea
						ref={commentRef}
						placeholder="Write a comment..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="min-h-[96px] border-none px-0 shadow-none focus-visible:ring-0"
					/>

					<div className="flex items-end justify-between gap-3">
						<span className="text-muted-foreground text-xs">Add your comment</span>
						<Button onClick={handleSubmit} disabled={isSubmitting || !comment.trim()} size="sm">
							{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
							Send
						</Button>
					</div>
				</div>

				<div className="text-muted-foreground text-sm">Comments ({comments?.length ?? 0})</div>

				<div className="space-y-3">
					{isLoading ? (
						<p className="text-muted-foreground text-sm">Loading comments...</p>
					) : (comments?.length ?? 0) === 0 ? (
						<p className="text-muted-foreground text-sm">No comments yet.</p>
					) : (
						comments?.map((item) => (
							<div key={item.id} className="flex gap-3">
								<Link href={`/users/${item.user.id}`}>
									<UserAvatar className="size-10" user={item.user} />
								</Link>
								<div className="bg-muted/50 flex flex-1 flex-col rounded-md px-3 py-2">
									<div className="flex items-center gap-2">
										<Link href={`/users/${item.user.id}`} className="text-sm font-semibold hover:underline">
											{item.user.name}
										</Link>
										<span className="text-muted-foreground text-xs">
											{new Date(item.created_at).toLocaleString(undefined, {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
									<p className="text-foreground text-sm">{item.content}</p>
									<div className="mt-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleToggleLike(item.id)}
											disabled={likingId === item.id}
											className={item.isLiked ? 'text-red-500 hover:text-red-600' : ''}
										>
											<Heart className={`mr-1 h-4 w-4 ${item.isLiked ? 'fill-current' : ''}`} />
											<span className="text-xs">{item.likesCount}</span>
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default PostComments;
