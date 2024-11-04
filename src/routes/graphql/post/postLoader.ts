import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Post } from '../types/Itypes.js';

export const createPostsLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Post[]>(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: authorIds as string[],
        },
      },
    });

    const postsByAuthorId = authorIds.map((authorId) =>
      posts.filter((post) => post.authorId === authorId),
    );
    return postsByAuthorId;
  });
};
