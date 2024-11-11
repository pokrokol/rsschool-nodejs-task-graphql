import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Post } from '../types/Itypes.js';

export const createPostsLoader = (prisma: PrismaClient) => {
   return new DataLoader(async (ids: readonly string[]) => {
     const posts: Post[] = await prisma.post.findMany({
       where: {
         authorId: {
           in: ids as string[],
         },
       },
     });

     return ids.map((id) => posts.filter((post) => post.authorId === id));
   });
};

export const createpostsByAuthorIdLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Post[]>(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...ids] } },
    });
    const postsMap = new Map();
    posts.forEach((post) => {
      if (!postsMap.has(post.authorId)) {
        postsMap.set(post.authorId, []);
      }
      postsMap.get(post.authorId).push(post);
    });
    return ids.map((authorId) => postsMap.get(authorId) || []);
  });
};
