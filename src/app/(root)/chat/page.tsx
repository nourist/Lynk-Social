'use client';

import ChatSidebar from './_components/chat-sidebar';
import ChatWindow from './_components/chat-window';

const Chat = () => {
	return (
		<div className="relative flex w-full overflow-hidden">
			<ChatSidebar />
			<div className="relative h-full flex-1">
				<div className="bg-card/50 h-full w-full overflow-y-auto p-6 pb-14 max-sm:p-3">
					<ChatWindow />
				</div>
			</div>
		</div>
	);
};

export default Chat;
