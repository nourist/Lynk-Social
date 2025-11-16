import UserList from './_components/user-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { getCurrentUser } from '~/services/auth';
import { getFollowersById, getFollowingsById, getUsers } from '~/services/user';

interface Props {
	searchParams: Promise<{ tab: string }>;
}

const Users = async ({ searchParams }: Props) => {
	const user = await getCurrentUser();

	return (
		<div className="p-6">
			<Tabs defaultValue={(await searchParams).tab || 'all'}>
				<TabsList className="bg-card gap-2 border p-1.5">
					<TabsTrigger className="data-[state=active]:text-primary" value="all">
						All
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary" value="followers">
						Followers
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary" value="followings">
						Followings
					</TabsTrigger>
				</TabsList>
				<TabsContent value="all">
					<UserList fetcher={getUsers} />
				</TabsContent>
				<TabsContent value="followers">
					<UserList
						fetcher={async (args) => {
							'use server';
							return getFollowersById(user.id || '', args);
						}}
					/>
				</TabsContent>
				<TabsContent value="followings">
					<UserList
						fetcher={async (args) => {
							'use server';
							return getFollowingsById(user.id || '', args);
						}}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Users;
