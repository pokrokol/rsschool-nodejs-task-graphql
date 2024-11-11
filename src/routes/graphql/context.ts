import { FastifyRequest, FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient type
import { initializeDataLoaders } from './loaders/allLoaders.js';

// Define the context type for type safety
interface Context {
  prisma: PrismaClient;
  loaders: ReturnType<typeof initializeDataLoaders>;
}

// Cache loaders by request to avoid repeated initializations
const loadersCache = new WeakMap<FastifyRequest, Context['loaders']>();

export function Context(req: FastifyRequest, fastify: FastifyInstance): Context {
  const prisma = fastify.prisma as PrismaClient; // Ensure prisma is typed correctly

  // Retrieve or initialize loaders for this request
  let loaders = loadersCache.get(req);
  if (!loaders) {
    loaders = initializeDataLoaders(prisma);
    loadersCache.set(req, loaders);
  }

  return {
    prisma,
    loaders,
  };
}
