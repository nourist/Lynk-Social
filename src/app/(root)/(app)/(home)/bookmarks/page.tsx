'use client';

import PostList from '~/components/post-list';
import { getBookmarkedPosts } from '~/services/post';

const Bookmarks = () => {
	return (
		<div className="space-y-6 xl:mx-8">
			<PostList type="bookmarks" fetcher={getBookmarkedPosts} />
		</div>
	);
};

export default Bookmarks;
