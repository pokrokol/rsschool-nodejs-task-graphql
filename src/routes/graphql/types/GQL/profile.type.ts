import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';



import { UUIDType } from '../uuid.js';
import { Profile } from '@prisma/client';

import { UserType } from './user.type.js';
import { MemberType, MemberTypeId } from './member.type.js';
import { Context } from '../Itypes.js';


export const ProfileType: GraphQLObjectType<Profile, Context> = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    user: {
      type: UserType,
      resolve: async (source, _args: unknown, context: Context) =>
        await context.prisma.user.findUnique({ where: { id: source.userId } }),
    },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: MemberType,
      resolve: async (source, _args: unknown, context: Context) =>
        await context.dataLoaders.memberTypeLoader.load(source.memberTypeId),
    },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  }),
});
export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  },
});