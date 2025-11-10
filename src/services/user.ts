'use server';

import { createClient } from '~/lib/supabase/server';

export const getUserById = async (id: string) => {
	const supabase = await createClient();

	const { data, error } = await supabase.from('users').select().eq('id', id).single();

	if (error) throw error;

	return data;
};
