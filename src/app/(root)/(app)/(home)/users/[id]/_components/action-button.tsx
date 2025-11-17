'use client';

import { UserCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { followUser, unfollowUser } from '~/services/user';

interface Props {
	userId: string;
	currentUserId: string;
	isFollowed: boolean;
}

const ActionButton = ({ userId, currentUserId, isFollowed }: Props) => {
	const router = useRouter();

	return userId == currentUserId ? (
		<Button variant="secondary" asChild>
			<Link href="/settings">Edit Profile</Link>
		</Button>
	) : isFollowed ? (
		<Button
			onClick={async () => {
				await unfollowUser(currentUserId, userId);
				router.refresh();
			}}
			variant="outline"
		>
			<UserCheck />
			Following
		</Button>
	) : (
		<Button
			onClick={async () => {
				await followUser(currentUserId, userId);
				router.refresh();
			}}
		>
			<UserPlus />
			Follow
		</Button>
	);
};

export default ActionButton;
