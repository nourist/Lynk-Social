import { PostSkeleton } from '~/components/post-list';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

const UserProfileLoading = () => {
	return (
		<div className="space-y-6 xl:mx-8">
			<Card className="relative overflow-hidden pt-0">
				{/* Banner skeleton */}
				<div className="relative h-40 overflow-hidden">
					<div className="bg-accent h-full w-full animate-pulse" />
				</div>

				{/* Avatar skeleton */}
				<Skeleton className="absolute top-40 left-12 size-40 -translate-y-1/2 rounded-full max-sm:left-1/2 max-sm:-translate-x-1/2" />

				{/* User info skeleton */}
				<div className="flex items-center justify-between gap-4 px-12 pb-2 max-sm:mt-20 max-sm:flex-col max-sm:text-center sm:pb-6">
					<div className="space-y-2 sm:ml-46">
						<Skeleton className="h-9 w-48" />
						<Skeleton className="h-4 w-64" />
					</div>

					{/* Action button skeleton */}
					<Skeleton className="h-9 w-24" />
				</div>
			</Card>

			{/* Tabs skeleton */}
			<Tabs defaultValue="posts" className="mt-6">
				<TabsList className="bg-card gap-2 border p-1.5">
					<TabsTrigger className="data-[state=active]:text-primary data-[state=active]:*:bg-transparent" value="posts" disabled>
						Posts
						<Badge variant="secondary">
							<Skeleton className="h-4 w-6" />
						</Badge>
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary data-[state=active]:*:bg-transparent" value="followers" disabled>
						Followers
						<Badge variant="secondary">
							<Skeleton className="h-4 w-6" />
						</Badge>
					</TabsTrigger>
					<TabsTrigger className="data-[state=active]:text-primary data-[state=active]:*:bg-transparent" value="followings" disabled>
						Followings
						<Badge variant="secondary">
							<Skeleton className="h-4 w-6" />
						</Badge>
					</TabsTrigger>
				</TabsList>
				<TabsContent className="space-y-6" value="posts">
					<PostSkeleton />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default UserProfileLoading;
