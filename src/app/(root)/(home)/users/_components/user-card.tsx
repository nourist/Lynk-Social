import Link from 'next/link';

import { Card, CardContent } from '~/components/ui/card';
import UserAvatar from '~/components/user-avatar';

interface Props {
	user: { id: string; name: string; avatar: string | null; bio: string };
}

const UserCard = ({ user }: Props) => {
	return (
		<Card>
			<CardContent>
				<Link className="flex items-center justify-center gap-2" href={`/users/${user.id}`}>
					<UserAvatar className="size-12" user={user} />
					<div className="max-w-65 min-w-55 flex-1 space-y-1">
						<div className="font-bold">{user.name}</div>
						<div className="text-muted-foreground truncate overflow-hidden text-sm">{user.bio}</div>
					</div>
				</Link>
			</CardContent>
		</Card>
	);
};

export default UserCard;
