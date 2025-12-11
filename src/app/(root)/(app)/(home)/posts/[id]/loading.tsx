import { ArrowLeft } from 'lucide-react';

import { PostSkeleton } from '~/components/post-list';
import { Button } from '~/components/ui/button';

export default function PostLoading() {
	return (
		<div className="space-y-4 xl:mx-8">
			<div>
				<Button variant="ghost" size="sm" className="-ml-2">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
			</div>

			<PostSkeleton />
		</div>
	);
}
