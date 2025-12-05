'use client';

import { useSearchParams } from 'next/navigation';

import PostList from '~/components/post-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import UserList from '~/components/user-list';
import { getPostsByUserId } from '~/services/post';
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
