import CreatePost from './_components/create-post';
import PostList from '~/components/post-list';
import { getHomePosts } from '~/services/post';

const Home = () => {
	return (
		<div className="xl:mx-8">
			<CreatePost />
			<div className="mt-6 space-y-6">
				<PostList type="home" fetcher={getHomePosts} />
			</div>
		</div>
	);
};

export default Home;
