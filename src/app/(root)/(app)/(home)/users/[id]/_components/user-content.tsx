'use client';

import { useSearchParams } from 'next/navigation';

import PostList from '~/components/post-list';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import UserList from '~/components/user-list';
import { getPostsByUserId } from '~/services/post';
import { type UserStats, getFollowersById, getFollowingsById } from '~/services/user';

interface Props {
	userId: string;
	stats: UserStats;
}

const UserContent = ({ userId, stats }: Props) => {
	const searchParams = useSearchParams();

	return (
		<>
			<Tabs defaultValue={searchParams.get('tab') || 'posts'} className="mt-6">
				<TabsList className="bg-card gap-2 border p-1.5">
					<TabsTrigger className="data-[state=active]:text-primary data-[state=active]:*:bg-transparent" value="posts">
						Posts
						<Badge variant="secondary">{stats.postsCount}</Badge>
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary data-[state=active]:*:bg-transparent" value="followers">
						Followers
						<Badge variant="secondary">{stats.followersCount}</Badge>
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary data-[state=active]:*:bg-transparent" value="followings">
						Followings
						<Badge variant="secondary">{stats.followingsCount}</Badge>
					</TabsTrigger>
				</TabsList>
				<TabsContent className="space-y-6" value="posts">
					<PostList
						type={`posts-${userId}`}
						fetcher={async (args) => {
							return getPostsByUserId(userId || '', args);
						}}
					/>
				</TabsContent>
				<TabsContent value="followers">
					<UserList
						type={`followers-${userId}`}
						fetcher={async (args) => {
							return getFollowersById(userId || '', args);
						}}
					/>
				</TabsContent>
				<TabsContent value="followings">
					<UserList
						type={`followings-${userId}`}
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
