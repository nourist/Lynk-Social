import CreatePost from './_components/create-post';
import PostList from '~/components/post-list';
import { getHomePosts } from '~/services/post';

const Home = () => {
	return (
		<>
			<CreatePost />
			<div className="mt-6">
				<PostList fetcher={getHomePosts} />
			</div>
		</>
	);
};

export default Home;
