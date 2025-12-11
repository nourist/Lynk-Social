'use client';

import ChatEmptyState from './_components/chat-empty-state';
import ChatSidebar from './_components/chat-sidebar';

// import ChatWindow from './_components/chat-window';

const Chat = () => {
	return (
		<div className="flex w-full overflow-hidden">
			<ChatSidebar />
			<div className="flex-1 p-6">
				<ChatEmptyState />
			</div>
		</div>
	);
};

export default Chat;
