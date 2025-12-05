import ActionButton from './_components/action-button';
import UserContent from './_components/user-content';
import { Card } from '~/components/ui/card';
import UserAvatar from '~/components/user-avatar';
import { getCurrentUser } from '~/services/auth';
import { getUserById, getUserStatById, isUserFollowed } from '~/services/user';

interface Props {
	params: Promise<{ id: string }>;
}

const UserProfile = async ({ params }: Props) => {
	const user = await getUserById((await params).id);
	const currentUser = await getCurrentUser();
	const isFollowed = await isUserFollowed(currentUser.id, user.id);
	const stats = await getUserStatById(user.id);

	return (
		<div className="space-y-6 xl:mx-8">
			<Card className="relative overflow-hidden pt-0">
				<div className="relative h-42 overflow-hidden">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					{user.thumbnail ? <img src={user.thumbnail} alt="thumbnail" className="object-cover" /> : <div className="bg-accent h-full w-full"></div>}
				</div>
				<UserAvatar user={user} className="absolute top-42 left-12 size-40 -translate-y-1/2 max-sm:left-1/2 max-sm:-translate-x-1/2" />
				<div className="flex items-center justify-between gap-4 px-12 pb-2 max-sm:mt-20 max-sm:flex-col max-sm:text-center sm:pb-6">
					<div className="sm:ml-46">
						<h1 className="-mt-2 text-3xl font-bold">{user.name}</h1>
						<p className="text-muted-foreground text-sm">{user.bio}</p>
					</div>

					<ActionButton userId={user.id} currentUserId={currentUser.id} isFollowed={isFollowed} />
				</div>
			</Card>
			<UserContent userId={user.id} stats={stats} />
		</div>
	);
};

export default UserProfile;
