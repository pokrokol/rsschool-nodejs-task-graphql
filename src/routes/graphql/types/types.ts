import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

// Interface representing the application context
export interface AppContext {
  prismaClient: PrismaClient;
  dataLoaders: DataLoaders;
}

// Interface representing a membership type
export interface MembershipType {
  id: string;
  discountPercentage: number;
  monthlyPostLimit: number;
}

// Interface representing a user
export interface User {
  id: string;
  name: string;
  accountBalance: number;
  posts?: Post[];
  profile?: UserProfile;
  subscriptions?: Subscription[];
  subscribers?: Subscription[];
}

// Interface representing a post
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

// Interface representing a user's profile
export interface UserProfile {
  id: string;
  isMale: boolean;
  birthYear: number;
  userId: string;
  membershipTypeId: string;
}

// Interface representing a subscription relationship between users
export interface Subscription {
  subscriberId: string;
  authorId: string;
}

