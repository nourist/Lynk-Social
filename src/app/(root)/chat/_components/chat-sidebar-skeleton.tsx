import { Skeleton } from '~/components/ui/skeleton';

const ChatSidebarSkeleton = () => {
	return (
		<>
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-center justify-center gap-3 md:justify-start">
					<Skeleton className="size-10 rounded-full" />
					<div className="hidden flex-1 space-y-2 md:block">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-3 w-3/4" />
					</div>
				</div>
			))}
		</>
	);
};

export default ChatSidebarSkeleton;
