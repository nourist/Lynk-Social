'use client';

import { create } from 'zustand';

import type { FriendWithLastMessage } from '~/services/chat';

export type ChatMessage = NonNullable<FriendWithLastMessage['lastMessage']>;

export type ChatItem = {
	user: FriendWithLastMessage['friend'];
	messages: ChatMessage[];
};

type ChatState = {
	items: ChatItem[];
	isLoading: boolean;
	setItems: (items: ChatItem[]) => void;
	setLoading: (value: boolean) => void;
	prependMessage: (friendId: string, message: ChatMessage) => void;
};

export const useChatStore = create<ChatState>((set) => ({
	items: [],
	isLoading: true,
	setItems: (items) => set({ items }),
	setLoading: (value) => set({ isLoading: value }),
	prependMessage: (friendId, message) =>
		set((state) => ({
			items: state.items.map((item) => (item.user.id === friendId ? { ...item, messages: [message, ...item.messages] } : item)),
		})),
}));
