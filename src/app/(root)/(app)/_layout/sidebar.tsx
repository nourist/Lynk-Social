'use client';

import { House, Search, UsersRound } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { buttonVariants } from '~/components/ui/button';
import { Dock, DockIcon } from '~/components/ui/dock';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

const SidebarItem = ({ item }: { item: { name: string; href: string; icon: React.ElementType } }) => {
	const pathname = usePathname();
	const isActive = pathname === item.href;

	return (
		<Link
			href={item.href}
			className={cn(
				'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors outline-none',
				isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
			)}
		>
			{isActive && (
				<motion.div layoutId="sidebar-active" className="bg-secondary/80 absolute inset-0 rounded-xl" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
			)}

			<span className="relative z-10 flex items-center gap-3">
				<item.icon className={cn('size-5 transition-colors', isActive && 'fill-primary/20')} />
				<span className="text-base">{item.name}</span>
			</span>
		</Link>
	);
};

const Sidebar = () => {
	const navItems = [
		{ name: 'Home', href: '/', icon: House },
		{ name: 'Explore', href: '/explore', icon: Search },
		{ name: 'People', href: '/users', icon: UsersRound },
	];

	return (
		<>
			<div className="bg-card w-72 space-y-2 border-r p-3 max-md:hidden">
				<div className="mb-2 px-3 py-2">
					<p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Navigation</p>
				</div>
				<nav className="flex flex-col gap-1">
					{navItems.map((item) => (
						<SidebarItem key={item.name} item={item} />
					))}
				</nav>
			</div>
			{/* Magic dock for md screen */}
			<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
				<TooltipProvider>
					<Dock direction="middle" className="bg-card">
						{navItems.map((item) => (
							<DockIcon key={item.name}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link href={item.href} aria-label={item.name} className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
											<item.icon className="size-6" />
										</Link>
									</TooltipTrigger>
									<TooltipContent>
										<p>{item.name}</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>
						))}
					</Dock>
				</TooltipProvider>
			</div>
		</>
	);
};

export default Sidebar;
