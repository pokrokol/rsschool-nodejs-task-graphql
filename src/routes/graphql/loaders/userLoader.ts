import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { User } from '../types/Itypes.js';

export const createUserLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User | undefined>(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds as string[] },
      },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));
    return userIds.map((id) => userMap.get(id));
  });
};
export const userSubscribedToLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: ReadonlyArray<User['id']>) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: [...ids] } },
      include: { author: true },
    });
    const subscriptionsMap = new Map();
    subscriptions.forEach((sub) => {
      if (!subscriptionsMap.has(sub.subscriberId)) {
        subscriptionsMap.set(sub.subscriberId, []);
      }
      subscriptionsMap.get(sub.subscriberId).push(sub.author);
    });
    return ids.map((userId) => subscriptionsMap.get(userId) || []);
  });
};
export const subscribedToUserLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: ReadonlyArray<User['id']>) => {
     const subscribers = await prisma.subscribersOnAuthors.findMany({
       where: { authorId: { in: [...ids] } },
       include: { subscriber: true },
     });
     const subscribersMap = new Map();
     subscribers.forEach((sub) => {
       if (!subscribersMap.has(sub.authorId)) {
         subscribersMap.set(sub.authorId, []);
       }
       subscribersMap.get(sub.authorId).push(sub.subscriber);
     });
     return ids.map((userId) => subscribersMap.get(userId) || []);
  });
};