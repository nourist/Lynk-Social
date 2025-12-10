'use client';

import { useEffect } from 'react';

import Header from './_layout/header';
import { getMutualFriendsWithLastMessage } from '~/services/chat';
import { useChatStore } from '~/store/chat-store';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	const { setItems, setLoading } = useChatStore();

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const data = await getMutualFriendsWithLastMessage();
				setItems(
					data.map((item) => ({
						user: item.friend,
						messages: item.lastMessage ? [item.lastMessage] : [],
					})),
				);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [setItems, setLoading]);

	return (
		<>
			<Header />
			<div className="flex h-[calc(100vh-64px)] w-full">{children}</div>
		</>
	);
};

export default Layout;
