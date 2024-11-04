import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

// Updated Interface Names
export interface AppContext {
  prisma: PrismaClient;
  dataLoaders: Loaders;
}

export interface Membership {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export interface User {
  id: string;
  name: string;
  balance: number;
  posts?: Post[];
  profile?: Profile;
  userSubscribedTo?: Subscription[];
  subscribedToUser?: Subscription[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

export interface Subscription {
  subscriberId: string;
  authorId: string;
}

export interface Loaders {
  userLoader: DataLoader<string, User | undefined, string>;
  postsLoader: DataLoader<string, Post[] | undefined, string>;
  profileLoader: DataLoader<string, Profile | undefined, string>;
  memberTypeLoader: DataLoader<string, Membership | undefined, string>;
}
