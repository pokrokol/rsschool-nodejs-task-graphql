import { PrismaClient } from '@prisma/client';
import { DataLoaders } from '../types/Itypes.js';
import { createMemberTypeLoader } from './memberLoader.js';
import { createpostsByAuthorIdLoader, createPostsLoader } from './postLoader.js';
import { createProfileLoader } from './profileLoader.js';
import { createUserLoader, subscribedToUserLoader, userSubscribedToLoader } from './userLoader.js';

;

export const initializeDataLoaders = (prisma: PrismaClient): DataLoaders => ({
  userLoader: createUserLoader(prisma),
  postsLoader: createPostsLoader(prisma),
  profileLoader: createProfileLoader(prisma),
  memberTypeLoader: createMemberTypeLoader(prisma),
  postsByAuthorIdLoader: createpostsByAuthorIdLoader(prisma),
  userSubscribedToLoader: userSubscribedToLoader(prisma),
  subscribedToUserLoader: subscribedToUserLoader(prisma),
});
