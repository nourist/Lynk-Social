'use server';

import { getUserById } from './user';
import { createClient } from '~/lib/supabase/server';

export const getCurrentUser = async () => {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		throw error;
	}

	return getUserById(data.user.id);
};
