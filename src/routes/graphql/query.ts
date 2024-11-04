import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { MemberType, MemberTypeId } from './types/GQL/member.type.js';
import { PostType } from './types/GQL/post.type.js';
import { ProfileType } from './types/GQL/profile.type.js';
import { UserType } from './types/GQL/user.type.js';
import { UUIDType } from './types/uuid.js';
import { Context, User } from './types/Itypes.js';


export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_source: unknown, _args: unknown, context: Context) =>
        await context.prisma.memberType.findMany(),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source: unknown, _args: unknown, context: Context) =>
        await context.prisma.post.findMany(),
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: async (
        _source: unknown,
        _args: unknown,
        context: Context,
        info: GraphQLResolveInfo,
      ) => {
        const parsedInfo = parseResolveInfo(info);

        const {
          fields,
        }: {
          fields: { userSubscribedTo?: ResolveTree; subscribedToUser?: ResolveTree };
        } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo as ResolveTree,
          new GraphQLList(UserType),
        );

        const users: User[] = await context.prisma.user.findMany({
          include: {
            userSubscribedTo: !!fields.userSubscribedTo,
            subscribedToUser: !!fields.subscribedToUser,
          },
        });

        for (const user of users) {
          context.dataLoaders.userLoader.prime(user.id, user);
        }

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
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) =>
        await context.prisma.memberType.findUnique({ where: { id: args.id } }),
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
        await context.dataLoaders.userLoader.load(args.id),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source: unknown, args: { id: string }, context: Context) =>
        await context.prisma.profile.findUnique({ where: { id: args.id } }),
    },
  }),
});
