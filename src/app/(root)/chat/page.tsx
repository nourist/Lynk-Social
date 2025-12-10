'use client';

import { useSearchParams } from 'next/navigation';

import ChatEmptyState from './_components/chat-empty-state';
import ChatSidebar from './_components/chat-sidebar';
import ChatWindow from './_components/chat-window';

const Chat = () => {
	const searchParams = useSearchParams();
	const selectedId = searchParams.get('id');

	return (
		<div className="flex w-full overflow-hidden">
			<ChatSidebar />
			<div className="flex-1 p-6">{!selectedId ? <ChatEmptyState /> : <ChatWindow selectedId={selectedId} />}</div>
		</div>
	);
};

export default Chat;
