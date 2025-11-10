'use client';

import { House, Search, UsersRound } from 'lucide-react';
import Link from 'next/link';

import NavLink from '~/components/nav-link';
import { Button, buttonVariants } from '~/components/ui/button';
import { Dock, DockIcon } from '~/components/ui/dock';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

const Sidebar = () => {
	const navItems = [
		{ name: 'Home', href: '/', icon: House },
		{ name: 'Explore', href: '/explore', icon: Search },
		{ name: 'People', href: '/people', icon: UsersRound },
	];

	return (
		<>
			<div className="bg-card *:data-[active=true]:text-primary *:bg-secondary/70 *:hover:bg-secondary w-80 space-y-4 border-r p-6 *:h-12 *:w-full *:justify-start *:px-8! max-md:hidden">
				{navItems.map((item) => (
					<Button key={item.name} size="lg" variant="secondary" asChild>
						<NavLink href={item.href}>
							<item.icon />
							{item.name}
						</NavLink>
					</Button>
				))}
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
											<Button size="icon" variant="secondary" asChild className="size-11 rounded-full">
												<NavLink href={item.href}>
													<item.icon className="size-6" />
												</NavLink>
											</Button>
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
