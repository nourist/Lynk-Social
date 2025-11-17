'use client';

import { useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import UserList from '~/components/user-list';
import { getFollowersById, getFollowingsById } from '~/services/user';

interface Props {
	userId: string;
}

const UserContent = ({ userId }: Props) => {
	const searchParams = useSearchParams();

	return (
		<>
			<Tabs defaultValue={searchParams.get('tab') || 'posts'} className="mt-6">
				<TabsList className="bg-card gap-2 border p-1.5">
					<TabsTrigger className="data-[state=active]:text-primary" value="posts">
						Posts
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary" value="followers">
						Followers
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary" value="followings">
						Followings
					</TabsTrigger>
				</TabsList>
				<TabsContent value="followers">
					<UserList
						fetcher={async (args) => {
							return getFollowersById(userId || '', args);
						}}
					/>
				</TabsContent>
				<TabsContent value="followings">
					<UserList
						fetcher={async (args) => {
							return getFollowingsById(userId || '', args);
						}}
					/>
				</TabsContent>
			</Tabs>
		</>
	);
};

export default UserContent;
