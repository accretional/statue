import { getAllContent } from 'statue-ssg/cms/content-processor';

export const load = async () => {
  // Get all content and filter for blog posts
  const allContent = await getAllContent();
  const posts = allContent.filter(item => item.mainDirectory === 'blog');

  return {
    posts
  };
};
