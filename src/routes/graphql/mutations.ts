import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from "graphql";

import { PostType, CreatePostInputType, ChangePostInputType } from "./types/GQL/post.type.js";
import { ProfileType, CreateProfileInputType, ChangeProfileInputType } from "./types/GQL/profile.type.js";
import { UserType, CreateUserInputType, ChangeUserInputType } from "./types/GQL/user.type.js";
import { UUIDType } from "./types/uuid.js";
import { Context } from "./types/Itypes.js";

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: UserType,
      args: { input: { type: new GraphQLNonNull(CreateUserInputType) } },
      resolve: async (
        _source: unknown,
        args: { input: { name: string; balance: number } },
        context: Context,
      ) => {
        return await context.prisma.user.create({
          data: {
            name: args.input.name,
            balance: args.input.balance,
          },
        });
      },
    },

    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        input: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (
        _source: unknown,
        args: { id: string; input: { name: string; balance: number } },
        context: Context,
      ) => {
        return await context.prisma.user.update({
          where: { id: args.id },
          data: {
            name: args.input.name,
            balance: args.input.balance,
          },
        });
      },
    },

    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) => {
        const result = await context.prisma.user.delete({ where: { id: args.id } });
        return !!result;
      },
    },

    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _source: unknown,
        args: { userId: string; authorId: string },
        context: Context,
      ) => {
        return await context.prisma.user.update({
          where: { id: args.userId },
          data: { userSubscribedTo: { create: { authorId: args.authorId } } },
        });
      },
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _source: unknown,
        args: { userId: string; authorId: string },
        context: Context,
      ) => {
        const result = await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: { subscriberId: args.userId, authorId: args.authorId },
          },
        });
        return !!result;
      },
    },

    createPost: {
      type: PostType,
      args: { input: { type: new GraphQLNonNull(CreatePostInputType) } },
      resolve: async (
        _source: unknown,
        args: { input: { title: string; content: string; authorId: string } },
        context: Context,
      ) => {
        return await context.prisma.post.create({
          data: args.input,
        });
      },
    },

    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        input: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (
        _source: unknown,
        args: { id: string; input: { title: string; content: string } },
        context: Context,
      ) => {
        return await context.prisma.post.update({
          where: { id: args.id },
          data: args.input,
        });
      },
    },

    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) => {
        const result = await context.prisma.post.delete({ where: { id: args.id } });
        return !!result;
      },
    },

    createProfile: {
      type: ProfileType,
      args: { input: { type: new GraphQLNonNull(CreateProfileInputType) } },
      resolve: async (
        _source: unknown,
        args: {
          input: {
            userId: string;
            memberTypeId: string;
            isMale: boolean;
            yearOfBirth: number;
          };
        },
        context: Context,
      ) => {
        return await context.prisma.profile.create({
          data: args.input,
        });
      },
    },

    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        input: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (
        _source: unknown,
        args: { id: string; input: { isMale: boolean; yearOfBirth: number } },
        context: Context,
      ) => {
        return await context.prisma.profile.update({
          where: { id: args.id },
          data: args.input,
        });
      },
    },

    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) => {
        const result = await context.prisma.profile.delete({ where: { id: args.id } });
        return !!result;
      },
    },
  }),
});
