import PostList from '~/components/post-list';
import { getExplorePosts } from '~/services/blog';

const Explore = () => {
	return (
		<div className="space-y-4">
			<PostList fetcher={getExplorePosts} />
		</div>
	);
};

export default Explore;
