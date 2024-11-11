import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { PostType, ChangePostInputType, CreatePostInputType } from './types/GQL/post.type.js';
import { ProfileType, ChangeProfileInputType, CreateProfileInputType } from './types/GQL/profile.type.js';
import { UserType, ChangeUserInputType, CreateUserInputType } from './types/GQL/user.type.js';
import { UUIDType } from './types/uuid.js';


const updateItem = async (
  context,
  model,
  id,
  data,
  loader,
  userIdKey: string | null = null,
) => {
  const item = await context.prisma[model].update({
    where: { id },
    data,
  });
  if (loader) {
    const key = userIdKey ? item[userIdKey] : id;
    context.loaders[loader].clear(key).prime(key, item);
  }
  return item;
};

const createItem = async (context, model, data, loader, keyField) => {
  const item = await context.prisma[model].create({ data });
  if (loader && keyField) context.loaders[loader].prime(item[keyField], item);
  return item;
};

export const MutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: (_source, { id, dto }, context) =>
        updateItem(context, 'user', id, dto, 'userLoader'),
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: (_source, { id, dto }, context) =>
        updateItem(context, 'profile', id, dto, 'profileLoader', 'userId'),
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: (_source, { id, dto }, context) =>
        updateItem(context, 'post', id, dto, null),
    },
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: (_source, { dto }, context) =>
        createItem(context, 'user', dto, 'userLoader', 'id'),
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: (_source, { dto }, context) =>
        createItem(context, 'profile', dto, 'profileLoader', 'id'),
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: (_source, { dto }, context) => {
        const post = context.prisma.post.create({ data: dto });
        context.loaders.postsByAuthorIdLoader.clear(dto.authorId);
        return post;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }, context) => {
        await context.prisma.user.delete({ where: { id } });
        context.loaders.userLoader.clear(id);
        return `User ${id} deleted successfully.`;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }, context) => {
        await context.prisma.profile.delete({ where: { id } });
        context.loaders.profileLoader.clear(id);
        return `Profile ${id} deleted successfully.`;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }, context) => {
        await context.prisma.post.delete({ where: { id } });
        return `Post ${id} deleted successfully.`;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { userId, authorId }, context) => {
        await context.prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
        context.loaders.userSubscribedToLoader.clear(userId);
        context.loaders.subscribedToUserLoader.clear(authorId);
        return `Subscribed successfully`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { userId, authorId }, context) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: { subscriberId: userId, authorId },
          },
        });
        context.loaders.userSubscribedToLoader.clear(userId);
        context.loaders.subscribedToUserLoader.clear(authorId);
        return `Unsubscribed successfully`;
      },
    },
  },
});
