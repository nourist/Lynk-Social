import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import UserAvatar from '~/components/user-avatar';
import { cn } from '~/lib/utils';
import type { ChatItem } from '~/store/chat-store';

interface ChatSidebarItemProps {
	item: ChatItem;
}

function getRelativeTime(dateString?: string) {
	if (!dateString) return '';
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return 'Just now';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
	if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
	return date.toLocaleDateString();
}

const ChatSidebarItem = ({ item }: ChatSidebarItemProps) => {
	const searchParams = useSearchParams();
	const selectedId = searchParams.get('id');
	const isActive = selectedId === item.user.id;
	const lastMessage = item.messages[0];

	return (
		<Link
			href={`/chat?id=${item.user.id}`}
			className={cn(
				'hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-3 rounded-lg p-3 transition-colors md:justify-start',
				isActive && 'bg-accent text-accent-foreground',
			)}
		>
			{' '}
			<UserAvatar className="size-10 border" user={{ ...item.user, name: item.user.name ?? 'Unknown' }} />
			<div className="hidden min-w-0 flex-1 flex-col gap-0.5 md:flex">
				<div className="flex items-center justify-between">
					<span className="truncate text-sm font-medium">{item.user.name}</span>
					<span className="text-muted-foreground text-[10px]">{getRelativeTime(lastMessage?.created_at)}</span>
				</div>
				<p className="text-muted-foreground line-clamp-1 text-xs">{lastMessage?.content ?? 'Sent an attachment'}</p>
			</div>
		</Link>
	);
};

export default ChatSidebarItem;
