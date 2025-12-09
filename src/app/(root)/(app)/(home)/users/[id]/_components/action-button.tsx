'use client';

import { UserCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { followUser, unfollowUser } from '~/services/user';

interface Props {
	userId: string;
	currentUserId: string;
	isFollowed: boolean;
}

const ActionButton = ({ userId, currentUserId, isFollowed }: Props) => {
	const [followed, setFollowed] = useState(isFollowed);

	return userId == currentUserId ? (
		<Button variant="secondary" asChild>
			<Link href="/settings">Edit Profile</Link>
		</Button>
	) : followed ? (
		<Button
			onClick={async () => {
				setFollowed(false);
				await unfollowUser(currentUserId, userId);
			}}
			variant="outline"
		>
			<UserCheck />
			Following
		</Button>
	) : (
		<Button
			onClick={async () => {
				setFollowed(true);
				await followUser(currentUserId, userId);
			}}
		>
			<UserPlus />
			Follow
		</Button>
	);
};

export default ActionButton;
