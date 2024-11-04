import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Profile } from '../types/types.js';


export const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Profile | undefined>(
    async (userIds: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: {
          userId: {
            in: userIds as string[],
          },
        },
      });

      const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
      return userIds.map((userId) => profileMap.get(userId));
    },
  );
};
