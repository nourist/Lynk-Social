import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { getShortName, stringToBrightColor } from '~/lib/utils';
import { cn } from '~/lib/utils';

interface Props {
	user: { avatar: string | null; name: string };
	className?: string;
}

const UserAvatar = ({ user, className = '' }: Props) => {
	return (
		<Avatar className={cn('size-8 *:min-h-full *:min-w-full', className)}>
			<AvatarImage src={user.avatar ?? undefined} alt={user.name} />
			<AvatarFallback style={{ background: stringToBrightColor(user.name) }} className="text-sm text-gray-800">
				{getShortName(user.name)}
			</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;
