import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { Context, Membership as MemberTypeInterface } from '../Itypes.js';
import { ProfileType } from './profile.type.js';


export const MemberType: GraphQLObjectType<MemberTypeInterface, Context> = new GraphQLObjectType(
  {
    name: 'MemberType',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeId) },
      discount: { type: new GraphQLNonNull(GraphQLFloat) },
      postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },

      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (source, _args, context: Context) =>
          await context.prisma.profile.findMany({ where: { memberTypeId: source.id } }),
      },
    }),
  },
);

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'basic' },
    BUSINESS: { value: 'business' },
  },
});
