'use server';

import { createClient } from '~/lib/supabase/server';
import type { Tables, TablesInsert } from '~/types/database.type';

export type CreatePostInput = {
	title: string;
	description: string;
	imageUrl?: string | null;
	videoUrl?: string | null;
};

export const createPost = async ({ title, description, imageUrl = null, videoUrl = null }: CreatePostInput) => {
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

	const payload: TablesInsert<'posts'> = {
		title,
		content: description,
		image: imageUrl,
		video: videoUrl,
		author_id: user.id,
	};

	const { error } = await supabase.from('posts').insert(payload);

	if (error) {
		throw error;
	}
};

export type PostAuthor = Pick<Tables<'users'>, 'id' | 'name' | 'avatar' | 'bio'>;

export type PostItem = Pick<Tables<'posts'>, 'id' | 'title' | 'content' | 'image' | 'video' | 'created_at'> & {
	author: PostAuthor;
	isLiked: boolean;
};

export type PostListResponse = {
	data: PostItem[];
	count: number | null;
};

type PaginationParams = {
	limit?: number;
	offset?: number;
};

export const getHomePosts = async ({ limit = 20, offset = 0 }: PaginationParams = {}): Promise<PostListResponse> => {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();
	if (authError || !user) throw new Error('Unauthorized');

	const { data, error } = await supabase.rpc('get_home_posts', {
		p_user_id: user.id,
		p_limit: limit,
		p_offset: offset,
	});

	if (error) throw error;

	return {
		data:
			data?.map((post) => ({
				...post,
				author: post.author as PostAuthor,
				isLiked: post.is_liked,
			})) ?? [],
		count: data?.[0].total_count ?? 0,
	};
};

export const getExplorePosts = async ({ limit = 20, offset = 0 }: PaginationParams = {}): Promise<PostListResponse> => {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();
	if (authError || !user) throw new Error('Unauthorized');

	const { data, error } = await supabase.rpc('get_explore_posts', {
		p_user_id: user.id,
		p_limit: limit,
		p_offset: offset,
	});

	if (error) throw error;

	return {
		data:
			data?.map((post) => ({
				...post,
				author: post.author as PostAuthor,
				isLiked: post.is_liked,
			})) ?? [],
		count: data?.[0].total_count ?? 0,
	};
};

export const toggleLikePost = async (postId: string) => {
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

	// Check if already liked
	const { data: existingLike, error: checkError } = await supabase.from('user_like_posts').select().eq('post_id', postId).eq('user_id', user.id).maybeSingle();

	if (checkError) {
		throw checkError;
	}

	if (existingLike) {
		// Unlike
		const { error: deleteError } = await supabase.from('user_like_posts').delete().eq('post_id', postId).eq('user_id', user.id);

		if (deleteError) {
			throw deleteError;
		}
		return { liked: false };
	} else {
		// Like
		const { error: insertError } = await supabase.from('user_like_posts').insert({ post_id: postId, user_id: user.id });

		if (insertError) {
			throw insertError;
		}
		return { liked: true };
	}
};

export const getPostLikesCount = async (postId: string) => {
	const supabase = await createClient();

	const { count, error } = await supabase.from('user_like_posts').select('*', { count: 'exact', head: true }).eq('post_id', postId);

	if (error) {
		throw error;
	}

	return count ?? 0;
};

export const getPostById = async (postId: string): Promise<PostItem | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('posts')
		.select('id, title, content, image, video, created_at, author:users!posts_author_id_fkey(id, name, avatar, bio)')
		.eq('id', postId)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			return null; // Post not found
		}
		throw error;
	}

	return data as PostItem;
};
