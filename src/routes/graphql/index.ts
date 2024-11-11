import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, specifiedRules, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { schema } from './schema.js';
import { Context } from './context.js';

const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: { 200: gqlResponseSchema },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const context = Context(req, fastify);

      const document = parse(query);
      const validErrors = validate(schema, document, [
        ...specifiedRules,
        depthLimit(DEPTH_LIMIT),
      ]);

      if (validErrors.length) return { errors: validErrors };

      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: context,
      });
    },
  });
};

export default plugin;
