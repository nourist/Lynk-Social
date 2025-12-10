import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import UserAvatar from '~/components/user-avatar';
import { getCurrentUser } from '~/services/auth';
import { getFollowersById, getFollowingsById, getPopularUsers, getUsers } from '~/services/user';

const Sidebar = async () => {
	const user = await getCurrentUser();

	const [followings, followers, popular, users] = await Promise.all([
		getFollowingsById(user.id, { limit: 5 }),
		getFollowersById(user.id, { limit: 5 }),
		getPopularUsers({ limit: 5 }),
		getUsers({ limit: 5 }),
	]);

	const cards = [
		{
			title: 'Followings',
			data: followings.data,
			link: '/users?tab=followings',
		},
		{
			title: 'Followers',
			data: followers.data,
			link: '/users?tab=followers',
		},
		{
			title: 'Popular',
			data: [...popular.data, ...users.data.filter((u) => !popular.data.some((v) => u.id == v.id)).slice(0, 5 - popular.data.length)],
			link: '/users',
		},
	];

	return (
		<div className="no-scrollbar absolute top-6 right-6 bottom-6 space-y-6 overflow-y-auto max-lg:hidden">
			{cards
				.filter((item) => item.data.length != 0)
				.map((item) => (
					<Card className="w-72 gap-y-4" key={item.title}>
						<CardHeader>
							<CardTitle>{item.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{item.data.map((user) => (
								<Link href={`/users/${user.id}`} key={user.id} className="group flex items-center gap-2">
									<UserAvatar className="size-10" user={user} />
									<div>
										<div className="text-[15px] font-semibold group-hover:underline">{user.name}</div>
										<div className="w-45 truncate overflow-hidden text-xs">{user.bio}</div>
									</div>
								</Link>
							))}
						</CardContent>
						<CardFooter>
							<Link className="text-primary text-sm hover:underline" href={item.link}>
								See all...
							</Link>
						</CardFooter>
					</Card>
				))}
		</div>
	);
};

export default Sidebar;
