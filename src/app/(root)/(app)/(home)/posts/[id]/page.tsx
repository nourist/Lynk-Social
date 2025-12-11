import { notFound } from 'next/navigation';

import PostDetail from './post-detail';
import { getPostById } from '~/services/post';

type PostIdPageProps = {
	params: Promise<{ id: string }>;
};

const PostIdPage = async ({ params }: PostIdPageProps) => {
	const { id } = await params;
	const post = await getPostById(id);

	if (!post) {
		return notFound();
	}

	return <PostDetail post={post} />;
};

export default PostIdPage;
