'use server';

import { createClient } from '~/lib/supabase/server';

export const getUserById = async (id: string) => {
	const supabase = await createClient();

	const { data, error } = await supabase.from('users').select().eq('id', id).single();

	if (error) throw error;

	return data;
};

export const getFollowingsById = async (id: string, { limit = 20, offset = 0 } = {}) => {
	const supabase = await createClient();

	const { data, error, count } = await supabase
		.from('user_follows')
		.select('users:users!following_id(*)', { count: 'exact' })
		.eq('follower_id', id)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) throw error;

	return { data: data.map((item) => item.users), count };
};

export const getFollowersById = async (id: string, { limit = 20, offset = 0 } = {}) => {
	const supabase = await createClient();

	const { data, error, count } = await supabase
		.from('user_follows')
		.select('users:users!follower_id(*)', { count: 'exact' })
		.eq('following_id', id)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) throw error;

	return { data: data.map((item) => item.users), count };
};

export const getPopularUsers = async ({ limit = 20, offset = 0 } = {}) => {
	const supabase = await createClient();

	const { data, error } = await supabase.rpc('get_popular_users', { limit_n: limit, offset_n: offset });

	if (error) throw error;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return { count: data?.[0]?.total_users ?? 0, data: data.map(({ total_users, user_id, ...item }) => ({ ...item, id: user_id })) };
};

export const getUsers = async ({ limit = 20, offset = 0, search = '' } = {}) => {
	const supabase = await createClient();

	const { data, error, count } = await supabase
		.from('users')
		.select('*', { count: 'exact' })
		.like('name', `%${search}%`)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);
	if (error) throw error;
	return { data, count };
};

export const isUserFollowed = async (followerId: string, followingId: string) => {
	const supabase = await createClient();
	const { data, error } = await supabase.from('user_follows').select().eq('follower_id', followerId).eq('following_id', followingId).maybeSingle();
	if (error) throw error;
	return !!data;
};

export const followUser = async (followerId: string, followingId: string) => {
	const supabase = await createClient();
	const { error } = await supabase.from('user_follows').insert({ follower_id: followerId, following_id: followingId });
	if (error) throw error;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
	const supabase = await createClient();
	const { error } = await supabase.from('user_follows').delete().eq('follower_id', followerId).eq('following_id', followingId);
	if (error) throw error;
};
