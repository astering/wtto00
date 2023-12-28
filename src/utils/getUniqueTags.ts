import type { CollectionEntry } from 'astro:content';

import { slugifyStr } from './slugify';

const getUniqueTags = (posts: CollectionEntry<'blog'>[]) => {
  const filteredPosts = posts.filter(({ data }) => !data.draft);
  const tags: string[] = filteredPosts
    .flatMap((post) => post.data.labels)
    .map((tag) => slugifyStr(tag))
    .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
    .sort((tagA: string, tagB: string) => tagA.localeCompare(tagB));
  return tags;
};

export default getUniqueTags;
