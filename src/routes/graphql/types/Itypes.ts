import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

// Updated Interface Names
export interface Context {
  prisma: PrismaClient;
  loaders: DataLoaders;
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
export type Subscriptions = {
  subscribedToUser: {
    subscriberId: string;
    authorId: string;
  }[];
} & User;

export type Subscribers = {
  userSubscribedTo: {
    subscriberId: string;
    authorId: string;
  }[];
} & User;

export interface DataLoaders {
  userLoader: DataLoader<string, User | undefined, string>;
  postsLoader: DataLoader<string, Post[] | undefined, string>;
  profileLoader: DataLoader<string, Profile | undefined, string>;
  memberTypeLoader: DataLoader<string, Membership | undefined, string>;
  subscribedToUserLoader: DataLoader<string, Subscriptions[]>;
  userSubscribedToLoader: DataLoader<string, Subscribers[]>;
  postsByAuthorIdLoader: DataLoader<string, Post[] | undefined, string>;
}
