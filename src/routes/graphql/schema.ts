import { GraphQLSchema } from 'graphql';
import { MutationType as mutation } from './mutations.js';
import { query } from './query.js';

export const schema = new GraphQLSchema({ query, mutation });
