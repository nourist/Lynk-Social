'use client';

import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

import InfiniteScroll from '~/components/infinity-scroll';
import { Card, CardContent } from '~/components/ui/card';
import UserAvatar from '~/components/user-avatar';
import { getUsers } from '~/services/user';

interface Props {
	fetcher: ({ limit, offset }: { limit: number; offset: number }) => ReturnType<typeof getUsers>;
	type: string;
}

type UserFetcher = ({ limit, offset }: { limit: number; offset: number }) => ReturnType<typeof getUsers>;

interface UserPageProps {
	fetcher: UserFetcher;
	offset: number;
	type: string;
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
					<div className="max-w-[70%] flex-1 space-y-1">
						<div className="max-w-full overflow-hidden font-bold text-nowrap text-ellipsis">{user.name}</div>
						<div className="text-muted-foreground w-full truncate overflow-hidden text-sm">{user.bio}</div>
					</div>
				</Link>
			</CardContent>
		</Card>
	);
};

const UserSkeleton = () => (
	<Card className="animate-pulse">
		<CardContent className="flex items-center justify-center gap-2">
			<div className="bg-muted size-12 rounded-full" />
			<div className="max-w-65 min-w-55 space-y-1">
				<div className="bg-muted h-4 w-3/5 rounded" />
				<div className="bg-muted h-3 w-full rounded" />
			</div>
		</CardContent>
	</Card>
);

const UserPage = ({ fetcher, offset, type }: UserPageProps) => {
	const { data, isLoading, error } = useSWR(`${type}-users-${offset}`, () => fetcher({ limit: 20, offset }));

	if (error) {
		throw error;
	}

	if (isLoading) {
		return <UserSkeleton />;
	}

	return (
		<>
			{data?.data.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</>
	);
};

const UserList = ({ fetcher, type }: Props) => {
	const [cnt, setCnt] = useState(1);
	const { data, error } = useSWR(`${type}-users-0`, () => fetcher({ limit: 20, offset: 0 }));

	if (error) {
		throw error;
	}

	return (
		<InfiniteScroll
			hasMore={(data?.count ?? 0) > cnt * 20}
			loadMore={() => {
				setCnt((prev: number) => prev + 1);
			}}
		>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: cnt }, (_, i) => (
					<UserPage fetcher={fetcher} offset={i * 20} type={type} key={i} />
				))}
			</div>
		</InfiniteScroll>
	);
};

export default UserList;
