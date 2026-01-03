import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get all groups
   */
  async getAllGroups() {
    try {
      const groups = await this.prisma.group.findMany({
        select: {
          id: true,
          waGroupId: true,
          name: true,
          kasBalance: true,
          _count: {
            select: {
              members: true,
              matches: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return groups;
    } catch (error) {
      this.logger.error('Failed to fetch groups', error);
      throw error;
    }
  }

  /**
   * Get group by ID
   */
  async getGroupById(groupId: string) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
              createdAt: true,
            },
          },
          matches: {
            select: {
              id: true,
              name: true,
              price: true,
              matchDatetime: true,
              status: true,
            },
            take: 10,
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              members: true,
              matches: true,
            },
          },
        },
      });

      return group;
    } catch (error) {
      this.logger.error(`Failed to fetch group ${groupId}`, error);
      throw error;
    }
  }

  /**
   * Get group by WhatsApp Group ID
   */
  async getGroupByWaGroupId(waGroupId: string) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { waGroupId },
      });

      if (!group) {
        // Create new group if not exists
        return await this.createGroup({
          waGroupId,
          name: `Group ${waGroupId.split('@')[0]}`,
        });
      }

      return group;
    } catch (error) {
      this.logger.error(`Failed to fetch group by wa_group_id ${waGroupId}`, error);
      throw error;
    }
  }

  /**
   * Create new group
   */
  async createGroup(data: { waGroupId: string; name: string }) {
    try {
      const group = await this.prisma.group.create({
        data: {
          waGroupId: data.waGroupId,
          name: data.name,
          kasBalance: 0,
        },
      });

      this.logger.log(`New group created: ${data.name} (${data.waGroupId})`);
      return group;
    } catch (error) {
      this.logger.error('Failed to create group', error);
      throw error;
    }
  }

  /**
   * Update group name
   */
  async updateGroupName(groupId: string, name: string) {
    try {
      const group = await this.prisma.group.update({
        where: { id: groupId },
        data: { name },
      });

      return group;
    } catch (error) {
      this.logger.error(`Failed to update group ${groupId}`, error);
      throw error;
    }
  }

  /**
   * Get group statistics
   */
  async getGroupStats(groupId: string) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id: groupId },
        include: {
          _count: {
            select: {
              members: true,
              matches: true,
            },
          },
        },
      });

      if (!group) {
        return null;
      }

      return {
        groupId: group.id,
        name: group.name,
        kasBalance: group.kasBalance,
        totalMembers: group._count.members,
        totalMatches: group._count.matches,
        createdAt: group.createdAt,
      };
    } catch (error) {
      this.logger.error(`Failed to get group stats for ${groupId}`, error);
      throw error;
    }
  }
}
