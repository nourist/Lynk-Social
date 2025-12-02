'use server';

import { createClient } from '~/lib/supabase/server';
import type { TablesInsert } from '~/types/database.type';

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


