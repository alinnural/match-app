import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get all members in group
   */
  async getGroupMembers(groupId: string) {
    try {
      const members = await this.prisma.member.findMany({
        where: { groupId },
        select: {
          id: true,
          waUserId: true,
          name: true,
          phone: true,
          role: true,
          joinedAt: true,
          createdAt: true,
        },
        orderBy: {
          joinedAt: 'desc',
        },
      });

      return members;
    } catch (error) {
      this.logger.error(`Error getting members for group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Get member by ID
   */
  async getMemberById(memberId: string) {
    try {
      const member = await this.prisma.member.findUnique({
        where: { id: memberId },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return member;
    } catch (error) {
      this.logger.error(`Error getting member ${memberId}:`, error);
      throw error;
    }
  }

  /**
   * Create or get member by WhatsApp ID
   */
  async getOrCreateMember(groupId: string, waUserId: string, name: string, phone?: string) {
    try {
      // Try to find existing member
      let member = await this.prisma.member.findUnique({
        where: {
          groupId_waUserId: {
            groupId,
            waUserId,
          },
        },
      });

      // Create if doesn't exist
      if (!member) {
        member = await this.prisma.member.create({
          data: {
            groupId,
            waUserId,
            name,
            phone,
            role: 'member',
          },
        });

        this.logger.log(`New member created: ${name} in group ${groupId}`);
      }

      return member;
    } catch (error) {
      this.logger.error('Error creating/getting member:', error);
      throw error;
    }
  }

  /**
   * Update member
   */
  async updateMember(memberId: string, data: { name?: string; phone?: string; role?: string }) {
    try {
      const member = await this.prisma.member.update({
        where: { id: memberId },
        data,
      });

      this.logger.log(`Member ${memberId} updated`);
      return member;
    } catch (error) {
      this.logger.error(`Error updating member ${memberId}:`, error);
      throw error;
    }
  }

  /**
   * Remove member from group
   */
  async removeMember(memberId: string) {
    try {
      await this.prisma.member.delete({
        where: { id: memberId },
      });

      this.logger.log(`Member ${memberId} removed from group`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error removing member ${memberId}:`, error);
      throw error;
    }
  }

  /**
   * Get member stats
   */
  async getMemberStats(memberId: string) {
    try {
      const member = await this.prisma.member.findUnique({
        where: { id: memberId },
        include: {
          matchParticipants: {
            select: {
              matchId: true,
              amountDue: true,
            },
          },
          createdTransactions: {
            select: {
              id: true,
              amount: true,
            },
          },
          _count: {
            select: {
              matchParticipants: true,
              createdTransactions: true,
            },
          },
        },
      });

      if (!member) {
        throw new BadRequestException('Member tidak ditemukan');
      }

      // Calculate total amount due from matches
      const totalAmountDue = member.matchParticipants.reduce(
        (sum, p) => sum + Number(p.amountDue),
        0,
      );

      // Calculate total transactions created
      const totalTransactions = member.createdTransactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0,
      );

      return {
        memberId: member.id,
        name: member.name,
        phone: member.phone,
        matchesJoined: member._count.matchParticipants,
        totalAmountDue,
        transactionsCreated: member._count.createdTransactions,
        totalTransactionAmount: totalTransactions,
      };
    } catch (error) {
      this.logger.error(`Error getting member stats for ${memberId}:`, error);
      throw error;
    }
  }
}
