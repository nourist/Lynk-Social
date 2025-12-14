'use client';

import { useSearchParams } from 'next/navigation';

import ChatEmptyState from './chat-empty-state';
import ChatInput from './chat-input';
import MessageList from './message-list';
import { useChatStore } from '~/store/chat-store';

const ChatWindow = () => {
	const searchParams = useSearchParams();
	const selectedId = searchParams.get('id');

	const { isLoading } = useChatStore();

	if (isLoading) {
		return null;
	}

	if (!selectedId) {
		return <ChatEmptyState />;
	}

	return (
		<>
			<MessageList friendId={selectedId} />
			<ChatInput receiverId={selectedId} />
		</>
	);
};

export default ChatWindow;
