import PostList from '~/components/post-list';
import { getExplorePosts } from '~/services/post';

const Explore = () => {
	return (
		<div className="space-y-4">
			<PostList fetcher={getExplorePosts} />
		</div>
	);
};

export default Explore;
