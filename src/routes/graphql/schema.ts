import { GraphQLSchema } from 'graphql';
import { mutation } from './mutations.js';
import { query } from './query.js';

export const schema = new GraphQLSchema({ query, mutation });
