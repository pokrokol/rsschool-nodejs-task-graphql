import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { User } from '../types/types.js';


export const createUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User | undefined>(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds as string[] },
      },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));
    return userIds.map((id) => userMap.get(id));
  });
};
