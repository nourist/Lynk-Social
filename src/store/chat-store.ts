'use client';

import { create } from 'zustand';

import type { Database } from '~/types/database.type';

export type ChatMessage = Database['public']['Tables']['messages']['Row'];

// For backward compatibility with chat sidebar
export type ChatItem = {
	user: { id: string; name: string | null; avatar: string | null; bio: string | null; thumbnail: string | null };
	messages: ChatMessage[];
	hasMore: boolean;
};

export type MessageCursor = {
	created_at: string;
	id: string;
};

type ChatState = {
	// For message list with pagination
	appendMessages: (friendId: string, messages: ChatMessage[]) => void;
	prependMessages: (friendId: string, messages: ChatMessage[], hasMore: boolean) => void;

	// For chat sidebar (backward compatibility)
	items: ChatItem[];
	isLoading: boolean;
	setItems: (items: ChatItem[]) => void;
	setLoading: (isLoading: boolean) => void;
};

export const useChatStore = create<ChatState>((set) => ({
	items: [],
	isLoading: false,

	appendMessages: (friendId, messages) =>
		set((state) => {
			return {
				...state,
				items: state.items.map((item) => {
					if (item.user.id == friendId) {
						return {
							...item,
							messages: [...item.messages, ...messages],
						};
					}
					return item;
				}),
			};
		}),

	prependMessages: (friendId, messages, hasMore) =>
		set((state) => {
			return {
				...state,
				items: state.items.map((item) => {
					if (item.user.id == friendId) {
						return {
							...item,
							messages: [...messages, ...item.messages],
							hasMore,
						};
					}
					return item;
				}),
			};
		}),

	setItems: (items) => set({ items }),
	setLoading: (value) => set({ isLoading: value }),
}));
