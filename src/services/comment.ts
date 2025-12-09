'use server';

import type { PostAuthor } from './post';
import { createClient } from '~/lib/supabase/server';
import type { Tables } from '~/types/database.type';

export type CommentItem = Tables<'comments'> & { user: PostAuthor };

export const getCommentsByPostId = async (postId: string): Promise<CommentItem[]> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('comments')
		.select('id, content, created_at, post_id, reply_comment_id, user_id, user:users!comments_user_id_fkey(id, name, avatar, bio)')
		.eq('post_id', postId)
		.order('created_at', { ascending: true });

	if (error) {
		throw error;
	}

	return (
		data?.map((comment) => ({
			...comment,
			user: comment.user as PostAuthor,
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
