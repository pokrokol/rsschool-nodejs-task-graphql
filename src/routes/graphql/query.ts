import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import {

  parseResolveInfo,
} from 'graphql-parse-resolve-info';
import { MemberType, EMemberTypeId } from './types/GQL/member.type.js';
import { PostType } from './types/GQL/post.type.js';
import { ProfileType } from './types/GQL/profile.type.js';
import { UserType } from './types/GQL/user.type.js';
import { UUIDType } from './types/uuid.js';
import { Context} from './types/Itypes.js';


export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_source: unknown, _args: unknown, context: Context) =>
        await context.prisma.memberType.findMany(),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source: unknown, _args: unknown, context: Context) =>
        await context.prisma.post.findMany(),
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        _source: unknown,
        _args: unknown,
        context: Context,
        info: GraphQLResolveInfo,
      ) => {
        const parsedInfo = parseResolveInfo(info);
        const fields = parsedInfo?.fieldsByTypeName.User;

        if (!fields) {
          return context.prisma.user.findMany();
        }

        const include = [
          'profile',
          'posts',
          'userSubscribedTo',
          'subscribedToUser',
        ].reduce(
          (acc, field) => {
            if (fields[field]) acc[field] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        );

        const users = await context.prisma.user.findMany({ include });

        users.forEach((user) => context.loaders.userLoader.prime(user.id, user));

        return users;
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_source: unknown, _args: unknown, context: Context) =>
        await context.prisma.profile.findMany(),
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(EMemberTypeId) },
      },
      resolve: async (_source, { id }, context) => {
        return context.prisma.memberType.findUnique({ where: { id } });
      },
    },

    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) =>
        await context.prisma.post.findUnique({ where: { id: args.id } }),
    },

    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) =>
        await context.loaders.userLoader.load(args.id),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) =>
        await context.prisma.profile.findUnique({ where: { id: args.id } }),
    },
  }),
});
