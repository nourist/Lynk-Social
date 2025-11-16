'use client';

import { useEffect, useState } from 'react';

import UserCard from './user-card';
import InfiniteScroll from '~/components/infinity-scroll';
import { getUsers } from '~/services/user';

interface Props {
	fetcher: ({ limit, offset }: { limit: number; offset: number }) => ReturnType<typeof getUsers>;
}

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
