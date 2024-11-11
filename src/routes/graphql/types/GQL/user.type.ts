import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { UUIDType } from '../uuid.js';
import { Context, User } from '../Itypes.js';
import { PostType } from './post.type.js';
import { ProfileType } from './profile.type.js';



export const UserType: GraphQLObjectType<User, Context> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (source,_args, context) => {
        const { profileLoader } = context.loaders;
        return profileLoader.load(source.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (source,_args, context) => {
        const { postsByAuthorIdLoader } = context.loaders;
        return postsByAuthorIdLoader.load(source.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source,_args, context) => {
        if (source.userSubscribedTo) {
          const authorIds = source.userSubscribedTo.map((sub) => sub.authorId);
          const authors = await context.loaders.userLoader.loadMany(authorIds);
          return authors;
        }
        const { userSubscribedToLoader } = context.loaders;
        return userSubscribedToLoader.load(source.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source,_args, context) => {
        if (source.subscribedToUser) {
          const subscriberIds = source.subscribedToUser.map((sub) => sub.subscriberId);
          const subscribers = await context.loaders.userLoader.loadMany(subscriberIds);
          return subscribers;
        }
        const { subscribedToUserLoader } = context.loaders;
        return subscribedToUserLoader.load(source.id);
      },
    },
  }),
});



export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
