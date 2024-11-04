import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Membership } from '../types/Itypes.js';

export const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Membership | undefined>(
    async (memberTypeIds: readonly string[]) => {
      const memberTypes = await prisma.memberType.findMany({
        where: {
          id: {
            in: memberTypeIds as string[],
          },
        },
      });

      const memberTypeMap = new Map(
        memberTypes.map((memberType) => [memberType.id, memberType]),
      );
      return memberTypeIds.map((id) => memberTypeMap.get(id));
    },
  );
};
