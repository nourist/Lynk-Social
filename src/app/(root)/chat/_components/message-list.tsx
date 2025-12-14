'use client';

import { useRef, useState } from 'react';

import MessageItem from './message-item';
import InfiniteScroll from '~/components/infinity-scroll';
import { getMessages } from '~/services/chat';
import { useChatStore } from '~/store/chat-store';

interface MessageListProps {
	friendId: string;
}

const MessageList = ({ friendId }: MessageListProps) => {
	const { items, prependMessages } = useChatStore();
	const [isLoading, setIsLoading] = useState(false);
	const scrollRef = useRef(null);

	const friend = items.find((item) => item.user.id === friendId);

	const { messages, hasMore } = friend || { messages: [], hasMore: false };

	// Load more older messages
	const loadMore = async () => {
		if (isLoading || !hasMore || messages.length === 0) return;
		try {
			setIsLoading(true);

			const cursor = { created_at: messages[0].created_at, id: messages[0].id };
			const data = await getMessages(friendId, cursor, 20);

			prependMessages(friendId, data, data.length === 20);
		} catch (error) {
			console.error('Error loading more messages:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div ref={scrollRef} className="flex min-h-full flex-1 flex-col gap-4 p-6">
			<InfiniteScroll loadMore={loadMore} hasMore={hasMore} align="start">
				{messages.map((message) => {
					return <MessageItem key={message.id} message={message} friendId={friendId} />;
				})}
			</InfiniteScroll>
		</div>
	);
};

export default MessageList;
