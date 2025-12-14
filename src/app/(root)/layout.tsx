'use client';

import { useEffect } from 'react';

import Header from './_layout/header';
import { createClient } from '~/lib/supabase/client';
import { getCurrentUser } from '~/services/auth';
import { getMutualFriendsWithLastMessage } from '~/services/chat';
import { useChatStore } from '~/store/chat-store';
import type { Database } from '~/types/database.type';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	const { setItems, setLoading, appendMessages } = useChatStore();

	// Load chat sidebar data
	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const data = await getMutualFriendsWithLastMessage();
				setItems(
					data.map((item) => ({
						user: item.friend,
						messages: item.lastMessage ? [item.lastMessage] : [],
						hasMore: true,
						isLoading: false,
					})),
				);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [setItems, setLoading]);

	// Real-time subscription for new messages
	useEffect(() => {
		const supabase = createClient();
		let channel: ReturnType<typeof supabase.channel> | null = null;

		const setupSubscription = async () => {
			const currentUser = await getCurrentUser();

			channel = supabase
				.channel('messages-realtime')
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'messages',
					},
					(payload) => {
						const newMessage = payload.new as Database['public']['Tables']['messages']['Row'];
						// Determine the conversation ID (the other user's ID)
						const conversationId = newMessage.sender_id === currentUser.id ? newMessage.receiver_id : newMessage.sender_id;

						// Add message to the conversation
						appendMessages(conversationId, [newMessage]);
					},
				)
				.subscribe();
		};

		setupSubscription();

		return () => {
			if (channel) {
				supabase.removeChannel(channel);
			}
		};
	}, [appendMessages]);

	return (
		<>
			<Header />
			<div className="flex h-[calc(100vh-64px)] w-full">{children}</div>
		</>
	);
};

export default Layout;
