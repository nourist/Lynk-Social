import { notFound } from 'next/navigation';

import PostDetail from './post-detail';
import { getCommentsByPostId } from '~/services/comment';
import { getPostById } from '~/services/post';

type PostIdPageProps = {
	params: Promise<{ id: string }>;
};

const PostIdPage = async ({ params }: PostIdPageProps) => {
	const { id } = await params;
	const [post, comments] = await Promise.all([getPostById(id), getCommentsByPostId(id)]);

	if (!post) {
		return notFound();
	}

	return <PostDetail post={post} comments={comments} />;
};

export default PostIdPage;
