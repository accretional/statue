import { getContentByUrl, getAllContent } from 'statue-ssg/cms/content-processor';
import { error } from '@sveltejs/kit';

export const entries = () => {
  const posts = getAllContent().filter(item => item.mainDirectory === 'blog');
  return posts.map(post => ({ slug: post.slug }));
};

export const load = async ({ params }) => {
  const url = `/blog/${params.slug}`;
  const post = getContentByUrl(url);

  if (!post) {
    throw error(404, 'Post not found');
  }

  return {
    post
  };
};

