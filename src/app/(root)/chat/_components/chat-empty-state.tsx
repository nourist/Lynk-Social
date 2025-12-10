import { MessagesSquare } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty';

const ChatEmptyState = () => {
	return (
		<Empty className="mx-auto h-[80%]">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<MessagesSquare />
				</EmptyMedia>
			</EmptyHeader>

			<EmptyTitle>No conversation selected</EmptyTitle>
			<EmptyDescription>Choose a friend from the sidebar to start chatting.</EmptyDescription>
		</Empty>
	);
};

export default ChatEmptyState;
