import { Users } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty';

const ChatSidebarEmptyState = () => {
	return (
		<Empty className="p-2">
			<EmptyMedia variant="icon" className="size-8 [&_svg]:size-4">
				<Users />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle className="text-sm">No friends yet</EmptyTitle>
				<EmptyDescription className="text-xs">Start a conversation from the search bar.</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
};

export default ChatSidebarEmptyState;
