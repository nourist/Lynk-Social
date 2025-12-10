'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import ChatSidebarEmptyState from './chat-sidebar-empty-state';
import ChatSidebarItem from './chat-sidebar-item';
import ChatSidebarSkeleton from './chat-sidebar-skeleton';
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group';
import { useChatStore } from '~/store/chat-store';

const ChatSidebar = () => {
	const { items, isLoading } = useChatStore();
	const [searchQuery, setSearchQuery] = useState('');

	const filteredItems = items.filter((item) => item.user.name?.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<aside className="bg-card flex w-20 flex-col border-r transition-all duration-300 max-md:pt-2 md:w-80">
			<div className="hidden p-4 pb-4 md:block">
				<h2 className="mb-4 text-xl font-bold tracking-tight">Messages</h2>
				<div className="relative">
					<InputGroup className="bg-muted">
						<InputGroupAddon>
							<Search className="h-4 w-4" />
						</InputGroupAddon>
						<InputGroupInput placeholder="Search friends..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
					</InputGroup>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-2 pt-0 md:p-4 md:pt-0">
				<div className="space-y-2">
					{isLoading ? (
						<ChatSidebarSkeleton />
					) : filteredItems.length === 0 ? (
						<div className="hidden md:block">
							<ChatSidebarEmptyState />
						</div>
					) : (
						filteredItems.map((item) => <ChatSidebarItem key={item.user.id} item={item} />)
					)}
				</div>
			</div>
		</aside>
	);
};

export default ChatSidebar;
