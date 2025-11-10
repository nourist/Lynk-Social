'use client';

import { ChevronDown, House, LogOut, MessageCircle, Monitor, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';

import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Skeleton } from '~/components/ui/skeleton';
import UserAvatar from '~/components/user-avatar';
import { createClient } from '~/lib/supabase/client';
import { getCurrentUser } from '~/services/auth';

const Header = () => {
	const pathname = usePathname();
	const supabase = createClient();
	const { theme, setTheme, resolvedTheme } = useTheme();

	const { data: user, error } = useSWR('current-user', getCurrentUser);

	if (!user && error) {
		throw error;
	}

	return (
		<div className="bg-card flex h-16 w-full items-center gap-4 border-b px-6">
			<Link href="/" className="flex items-center-safe gap-2">
				<Image src="/logo.png" alt="logo" width={36} height={36} />
				<h1 className="text-xl font-bold">Lynk</h1>
			</Link>
			<Button variant="secondary" size="icon-lg" asChild className="ml-auto rounded-full">
				{pathname == '/chat' ? (
					<Link href="/">
						<House />
					</Link>
				) : (
					<Link href="/chat">
						<MessageCircle />
					</Link>
				)}
			</Button>
			{user ? (
				<DropdownMenu>
					<DropdownMenuTrigger className="flex items-center gap-1.5">
						<UserAvatar className="size-9" user={user} />
						<p className="hidden text-sm font-medium md:block">{user.name}</p>
						<ChevronDown className="size-6" />
					</DropdownMenuTrigger>
					<DropdownMenuContent sideOffset={12} side="bottom" align="end">
						<DropdownMenuItem asChild>
							<Link href={`/users/${user.id}`}>
								<User />
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								{resolvedTheme == 'light' ? <Sun /> : <Moon />}
								Appearance
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuCheckboxItem checked={theme == 'light'} onCheckedChange={() => setTheme('light')}>
										Light
										<Sun className="ml-auto" />
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={theme == 'dark'} onCheckedChange={() => setTheme('dark')}>
										Dark
										<Moon className="ml-auto" />
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={theme == 'system'} onCheckedChange={() => setTheme('system')}>
										System
										<Monitor className="ml-auto" />
									</DropdownMenuCheckboxItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem asChild>
							<Link href="/settings">
								<Settings />
								Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={() => supabase.auth.signOut()}>
							<LogOut />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className="flex items-center gap-1.5">
					<Skeleton className="size-9 rounded-full" />
					<Skeleton className="h-4 w-20" />
					<ChevronDown className="size-6" />
				</div>
			)}
		</div>
	);
};

export default Header;
