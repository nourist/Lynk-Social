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
