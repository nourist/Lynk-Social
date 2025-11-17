'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import InfiniteScroll from '~/components/infinity-scroll';
import { Card, CardContent } from '~/components/ui/card';
import UserAvatar from '~/components/user-avatar';
import { getUsers } from '~/services/user';

interface Props {
	fetcher: ({ limit, offset }: { limit: number; offset: number }) => ReturnType<typeof getUsers>;
}

interface UserCardProps {
	user: { id: string; name: string; avatar: string | null; bio: string };
}

const UserCard = ({ user }: UserCardProps) => {
	return (
		<Card>
			<CardContent>
				<Link className="flex items-center justify-center gap-2" href={`/users/${user.id}`}>
					<UserAvatar className="size-12" user={user} />
					<div className="max-w-65 min-w-55 flex-1 space-y-1">
						<div className="font-bold">{user.name}</div>
						<div className="text-muted-foreground truncate overflow-hidden text-sm">{user.bio}</div>
					</div>
				</Link>
			</CardContent>
		</Card>
	);
};

const UserList = ({ fetcher }: Props) => {
	const [offset, setOffset] = useState(0);
	const [data, setData] = useState<Awaited<ReturnType<typeof getUsers>>>({
		count: 1,
		data: [],
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log(offset);
		if (isLoading) return;
		setIsLoading(true);
		fetcher({ limit: 20, offset })
			.then((data) => {
				setData((prev) => ({
					count: data.count,
					data: [...prev.data, ...data.data],
				}));
			})
			.finally(() => setIsLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [offset]);

	return (
		<InfiniteScroll
			hasMore={(data.count ?? 0) > offset + 20}
			loadMore={() => {
				setOffset((prev: number) => prev + 20);
			}}
		>
			<div className="flex flex-wrap gap-6">
				{data.data.map((user) => (
					<UserCard key={user.id} user={user} />
				))}
			</div>
		</InfiniteScroll>
	);
};

export default UserList;
