import PostList from '~/components/post-list';
import { getExplorePosts } from '~/services/post';

const Explore = () => {
	return (
		<div className="space-y-6 xl:mx-8">
			<PostList type="explore" fetcher={getExplorePosts} />
		</div>
	);
};

export default Explore;
