'use server';

import { createClient } from '~/lib/supabase/server';
import { getCurrentUser } from '~/services/auth';
import type { Database } from '~/types/database.type';

type MessageRow = Database['public']['Tables']['messages']['Row'];
export type FriendWithLastMessage = {
	friend: {
		id: string;
		name: string | null;
		avatar: string | null;
		bio: string | null;
		thumbnail: string | null;
	};
	lastMessage: Pick<MessageRow, 'id' | 'content' | 'created_at' | 'sender_id' | 'receiver_id' | 'type' | 'image' | 'video'> | null;
};

export const getMutualFriendsWithLastMessage = async (): Promise<FriendWithLastMessage[]> => {
	const supabase = await createClient();
	const currentUser = await getCurrentUser();

	const { data, error } = await supabase.rpc('get_mutual_friends_with_last_message', { p_user_id: currentUser.id });

	if (error) {
		throw error;
	}

	return (
		data.map((row) => ({
			friend: {
				id: row.friend_id,
				name: row.friend_name,
				avatar: row.friend_avatar,
				bio: row.friend_bio,
				thumbnail: row.friend_thumbnail,
			},
			lastMessage: row.last_message_id
				? {
						id: row.last_message_id,
						content: row.last_message_content,
						created_at: row.last_message_created_at!,
						sender_id: row.last_message_sender_id!,
						receiver_id: row.last_message_receiver_id!,
						type: row.last_message_type!,
						image: row.last_message_image,
						video: row.last_message_video,
					}
				: null,
		})) ?? []
	);
};

type CreateMessageParams = {
	receiverId: string;
	type: Database['public']['Enums']['message_type'];
	content?: string | null;
	image?: string | null;
	video?: string | null;
};

export const createMessage = async (params: CreateMessageParams): Promise<MessageRow> => {
	const supabase = await createClient();
	const currentUser = await getCurrentUser();

	const { data, error } = await supabase
		.from('messages')
		.insert({
			sender_id: currentUser.id,
			receiver_id: params.receiverId,
			type: params.type,
			content: params.content,
			image: params.image,
			video: params.video,
		})
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
};
export const getMessages = async (userId: string, cursor?: { created_at: string; id: string } | null, limit: number = 20): Promise<MessageRow[]> => {
	const supabase = await createClient();
	const currentUser = await getCurrentUser();

	let query = supabase
		.from('messages')
		.select('*')
		.or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`);

	// Apply cursor if provided
	if (cursor) {
		// For pagination, we want messages BEFORE the cursor
		// Since we're ordering by created_at ASC, we want messages with:
		// created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id)
		// But we need to fetch from the database with descending order first, then reverse
		query = query.order('created_at', { ascending: false }).order('id', { ascending: false }).filter('created_at', 'lt', cursor.created_at).limit(limit);
	} else {
		// Initial load - get most recent messages in descending order
		query = query.order('created_at', { ascending: false }).order('id', { ascending: false }).limit(limit);
	}

	const { data, error } = await query;

	if (error) {
		throw error;
	}

	// Reverse to get ascending order (oldest to newest)
	return (data as MessageRow[]).reverse();
};
