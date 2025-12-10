'use server';

import { createClient } from '~/lib/supabase/server';
import type { Tables } from '~/types/database.type';
import type { PostAuthor } from './post';

export type CommentItem = Tables<'comments'> & { user: PostAuthor; isLiked: boolean; likesCount: number };

export const getCommentsByPostId = async (postId: string): Promise<CommentItem[]> => {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError) {
		throw authError;
	}

	if (!user) {
		throw new Error('Unauthorized');
	}

	const { data, error } = await supabase
		.from('comments')
		.select('id, content, created_at, post_id, reply_comment_id, user_id, user:users!comments_user_id_fkey(id, name, avatar, bio)')
		.eq('post_id', postId)
		.order('created_at', { ascending: true });

	if (error) {
		throw error;
	}

	const commentIds = data?.map((c) => c.id) ?? [];

	if (commentIds.length === 0) {
		return [];
	}

	const { data: likes, error: likesError } = await supabase.from('user_like_comments').select('comment_id, user_id').in('comment_id', commentIds);

	if (likesError) {
		throw likesError;
	}

	const likeCounts = new Map<string, number>();
	const likedByUser = new Set<string>();

	likes?.forEach((like) => {
		likeCounts.set(like.comment_id, (likeCounts.get(like.comment_id) ?? 0) + 1);
		if (like.user_id === user.id) {
			likedByUser.add(like.comment_id);
		}
	});

	return (
		data?.map((comment) => ({
			...comment,
			user: comment.user as PostAuthor,
			likesCount: likeCounts.get(comment.id) ?? 0,
			isLiked: likedByUser.has(comment.id),
		})) ?? []
	);
};

type CreateCommentInput = {
	postId: string;
	content: string;
	replyCommentId?: string | null;
};

export const createComment = async ({ postId, content, replyCommentId = null }: CreateCommentInput) => {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError) {
		throw authError;
	}

	if (!user) {
		throw new Error('Unauthorized');
	}

	const { error } = await supabase.from('comments').insert({
		post_id: postId,
		content,
		reply_comment_id: replyCommentId,
		user_id: user.id,
	});

	if (error) {
		throw error;
	}
};

export const toggleLikeComment = async (commentId: string) => {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError) {
		throw authError;
	}

	if (!user) {
		throw new Error('Unauthorized');
	}

	const { data: existingLike, error: checkError } = await supabase
		.from('user_like_comments')
		.select()
		.eq('comment_id', commentId)
		.eq('user_id', user.id)
		.maybeSingle();

	if (checkError) {
		throw checkError;
	}

	if (existingLike) {
		const { error: deleteError } = await supabase.from('user_like_comments').delete().eq('comment_id', commentId).eq('user_id', user.id);
		if (deleteError) {
			throw deleteError;
		}
		return { liked: false };
	}

	const { error: insertError } = await supabase.from('user_like_comments').insert({ comment_id: commentId, user_id: user.id });

	if (insertError) {
		throw insertError;
	}

	return { liked: true };
};
