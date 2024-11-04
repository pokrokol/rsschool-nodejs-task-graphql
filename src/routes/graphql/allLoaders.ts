import { PrismaClient } from '@prisma/client';
import { Loaders } from './types/Itypes.js';
import { createUserLoader } from './user/userLoader.js';
import { createMemberTypeLoader } from './member/memberLoader.js';
import { createPostsLoader } from './post/postLoader.js';
import { createProfileLoader } from './profile/profileLoader.js';
;

export const initializeDataLoaders = (prisma: PrismaClient): Loaders => ({
  userLoader: createUserLoader(prisma),
  postsLoader: createPostsLoader(prisma),
  profileLoader: createProfileLoader(prisma),
  memberTypeLoader: createMemberTypeLoader(prisma),
});
