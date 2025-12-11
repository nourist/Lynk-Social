'use client';

import { Heart, Loader2, MessageSquareDashed, Send } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '~/components/ui/input-group';
import UserAvatar from '~/components/user-avatar';
import { CommentItem, createComment, toggleLikeComment } from '~/services/comment';

type TextareaRef = React.RefObject<HTMLTextAreaElement | null> | React.MutableRefObject<HTMLTextAreaElement | null>;

type PostCommentsProps = {
	postId: string;
	textareaRef?: TextareaRef;
	initialComments: CommentItem[];
};

const PostComments = ({ postId, textareaRef, initialComments }: PostCommentsProps) => {
	const internalRef = useRef<HTMLTextAreaElement | null>(null);
	const commentRef = textareaRef ?? internalRef;
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState<CommentItem[]>(initialComments);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [likingId, setLikingId] = useState<string | null>(null);

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
			const newComment = await createComment({ postId, content });
			setComments((prev) => [...prev, newComment]);
			setComment('');
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleToggleLike = async (commentId: string) => {
		const targetComment = comments.find((c) => c.id === commentId);
		if (!targetComment) return;

		// Optimistic update
		setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, isLiked: !c.isLiked, likesCount: c.likesCount + (c.isLiked ? -1 : 1) } : c)));

		setLikingId(commentId);
		try {
			await toggleLikeComment(commentId);
			// No need to refetch if successful, optimistic update is sufficient
			// Or we could revert on error
		} catch (err) {
			console.error(err);
			// Revert optimistic update
			setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, isLiked: !c.isLiked, likesCount: c.likesCount + (c.isLiked ? -1 : 1) } : c)));
		} finally {
			setLikingId(null);
		}
	};

	return (
		<Card>
			<CardContent className="space-y-4">
				<InputGroup className="bg-transparent">
					<InputGroupTextarea ref={commentRef} placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-24" />
					<InputGroupAddon align="block-end" className="flex items-end justify-between gap-3">
						<span className="text-muted-foreground text-xs">Add your comment</span>
						<InputGroupButton variant="default" onClick={handleSubmit} disabled={isSubmitting || !comment.trim()} size="sm">
							{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
							Send
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>

				<div className="text-muted-foreground text-sm">Comments ({comments.length})</div>

				<div className="space-y-3">
					{comments.length === 0 ? (
						<Empty className="py-8">
							<EmptyMedia>
								<MessageSquareDashed className="text-muted-foreground size-10" />
							</EmptyMedia>
							<EmptyHeader>
								<EmptyTitle>No comments yet</EmptyTitle>
								<EmptyDescription>Be the first to share your thoughts!</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						comments.map((item) => (
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
