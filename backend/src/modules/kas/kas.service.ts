import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class KasService {
  private readonly logger = new Logger(KasService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Record kas transaction
   */
  async recordTransaction(data: {
    groupId: string;
    type: 'income' | 'expense';
    amount: number;
    description?: string;
    matchId?: string;
    createdById?: string;
  }) {
    try {
      const transaction = await this.prisma.kasTransaction.create({
        data: {
          groupId: data.groupId,
          type: data.type,
          amount: new Decimal(data.amount),
          description: data.description,
          matchId: data.matchId,
          createdById: data.createdById,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update group kas balance
      await this.updateGroupBalance(
        data.groupId,
        data.type === 'income' ? data.amount : -data.amount,
      );

      this.logger.log(
        `Kas transaction recorded: ${data.type} ${data.amount} for group ${data.groupId}`,
      );
      return transaction;
    } catch (error) {
      this.logger.error('Error recording transaction:', error);
      throw error;
    }
  }

  /**
   * Update group kas balance
   */
  private async updateGroupBalance(groupId: string, amount: number) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!group) {
        throw new BadRequestException('Grup tidak ditemukan');
      }

      const newBalance = new Decimal(group.kasBalance).plus(new Decimal(amount));

      await this.prisma.group.update({
        where: { id: groupId },
        data: { kasBalance: newBalance },
      });
    } catch (error) {
      this.logger.error('Error updating group balance:', error);
      throw error;
    }
  }

  /**
   * Get group kas balance
   */
  async getGroupKasBalance(groupId: string) {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id: groupId },
        select: {
          id: true,
          name: true,
          kasBalance: true,
        },
      });

      if (!group) {
        throw new BadRequestException('Grup tidak ditemukan');
      }

      return {
        groupId: group.id,
        groupName: group.name,
        balance: Number(group.kasBalance),
      };
    } catch (error) {
      this.logger.error(`Error getting kas balance for group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Get kas transaction history
   */
  async getTransactionHistory(groupId: string, limit: number = 20) {
    try {
      const transactions = await this.prisma.kasTransaction.findMany({
        where: { groupId },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          match: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      return transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        description: t.description,
        matchName: t.match?.name,
        createdBy: t.createdBy?.name || 'System',
        createdAt: t.createdAt,
      }));
    } catch (error) {
      this.logger.error(
        `Error getting transaction history for group ${groupId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Calculate bill settlement
   * Returns who needs to pay whom
   */
  async calculateSettlement(groupId: string, matchId: string) {
    try {
      // Get match details
      const match = await this.prisma.match.findUnique({
        where: { id: matchId },
        include: {
          participants: {
            include: {
              member: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!match) {
        throw new BadRequestException('Pertandingan tidak ditemukan');
      }

      if (!match.price) {
        return {
          matchId: match.id,
          matchName: match.name,
          settlement: [],
          totalCost: 0,
        };
      }

      const totalCost = Number(match.price) * match.participants.length;
      const amountPerPerson = totalCost / match.participants.length;

      const settlement = match.participants
        .filter((p) => p.member !== null)
        .map((p) => ({
          memberId: p.member!.id,
          memberName: p.member!.name,
          amountDue: amountPerPerson,
        }));

      return {
        matchId: match.id,
        matchName: match.name,
        participants: match.participants.length,
        totalCost,
        amountPerPerson,
        settlement,
      };
    } catch (error) {
      this.logger.error('Error calculating settlement:', error);
      throw error;
    }
  }

  /**
   * Apply settlement to kas (end match with bill calculation)
   */
  async applySettlement(groupId: string, matchId: string, adminId?: string) {
    try {
      const settlement = await this.calculateSettlement(groupId, matchId);

      // Record transaction for each participant
      const transactions = [];
      for (const item of settlement.settlement) {
        const transaction = await this.recordTransaction({
          groupId,
          type: 'income',
          amount: item.amountDue,
          description: `Bill dari pertandingan: ${settlement.matchName}`,
          matchId,
          createdById: adminId,
        });
        transactions.push(transaction);
      }

      this.logger.log(`Settlement applied for match ${matchId}`);

      return {
        success: true,
        matchId,
        totalCollected: settlement.totalCost,
        transactionsCreated: transactions.length,
      };
    } catch (error) {
      this.logger.error('Error applying settlement:', error);
      throw error;
    }
  }

  /**
   * Get group members with balance
   */
  async getGroupMembersBalance(groupId: string) {
    try {
      const members = await this.prisma.member.findMany({
        where: { groupId },
        select: {
          id: true,
          name: true,
          phone: true,
          createdAt: true,
        },
      });

      return members;
    } catch (error) {
      this.logger.error(`Error getting group members for ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Reset group kas balance (admin only)
   */
  async resetGroupBalance(groupId: string) {
    try {
      await this.prisma.group.update({
        where: { id: groupId },
        data: { kasBalance: new Decimal(0) },
      });

      this.logger.log(`Group ${groupId} kas balance reset`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error resetting balance for group ${groupId}:`, error);
      throw error;
    }
  }
}
