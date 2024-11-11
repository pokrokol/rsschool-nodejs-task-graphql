import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';



import { UUIDType } from '../uuid.js';
import { Profile } from '@prisma/client';


import { MemberType, EMemberTypeId } from './member.type.js';
import { Context } from '../Itypes.js';


export const ProfileType: GraphQLObjectType<Profile, Context> = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source: { memberTypeId: string }, _args, context: Context) => {
        const { memberTypeLoader } = context.loaders;
        return memberTypeLoader.load(source.memberTypeId);
      },
    },
  }),
});





export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(EMemberTypeId) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: EMemberTypeId },
  },
});