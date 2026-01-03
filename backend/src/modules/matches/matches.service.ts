import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Create new match
   */
  async createMatch(data: {
    groupId: string;
    name: string;
    venue: string;
    matchDatetime: Date;
    price?: number;
    maxParticipants?: number;
    createdById?: string;
  }) {
    try {
      const match = await this.prisma.match.create({
        data: {
          groupId: data.groupId,
          name: data.name,
          venue: data.venue,
          matchDatetime: data.matchDatetime,
          price: data.price ? new Decimal(data.price) : null,
          maxParticipants: data.maxParticipants,
          createdById: data.createdById,
        },
        include: {
          participants: true,
          createdBy: true,
        },
      });

      this.logger.log(`Match created: ${data.name} in group ${data.groupId}`);
      return match;
    } catch (error) {
      this.logger.error('Error creating match:', error);
      throw error;
    }
  }

  /**
   * Get match by ID
   */
  async getMatchById(matchId: string) {
    try {
      const match = await this.prisma.match.findUnique({
        where: { id: matchId },
        include: {
          participants: {
            include: {
              member: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
      });

      return match;
    } catch (error) {
      this.logger.error(`Error getting match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Get all matches in group
   */
  async getGroupMatches(groupId: string, status?: string) {
    try {
      const where: any = { groupId };
      if (status) {
        where.status = status;
      }

      const matches = await this.prisma.match.findMany({
        where,
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return matches;
    } catch (error) {
      this.logger.error(`Error getting matches for group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Add participant to match
   */
  async addParticipant(matchId: string, memberId: string) {
    try {
      // Check if already joined
      const existing = await this.prisma.matchParticipant.findUnique({
        where: {
          matchId_memberId: {
            matchId,
            memberId,
          },
        },
      });

      if (existing) {
        throw new BadRequestException('Sudah bergabung ke pertandingan ini');
      }

      const match = await this.getMatchById(matchId);
      if (!match) {
        throw new BadRequestException('Pertandingan tidak ditemukan');
      }

      // Check max participants
      if (
        match.maxParticipants &&
        match._count.participants >= match.maxParticipants
      ) {
        throw new BadRequestException('Pertandingan sudah penuh');
      }

      const participant = await this.prisma.matchParticipant.create({
        data: {
          matchId,
          memberId,
          amountDue: match.price || new Decimal(0),
        },
        include: {
          member: true,
        },
      });

      this.logger.log(`Member ${memberId} joined match ${matchId}`);
      return participant;
    } catch (error) {
      this.logger.error('Error adding participant:', error);
      throw error;
    }
  }

  /**
   * Remove participant from match
   */
  async removeParticipant(matchId: string, memberId: string) {
    try {
      await this.prisma.matchParticipant.delete({
        where: {
          matchId_memberId: {
            matchId,
            memberId,
          },
        },
      });

      this.logger.log(`Member ${memberId} left match ${matchId}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Error removing participant:', error);
      throw error;
    }
  }

  /**
   * Get match participants
   */
  async getParticipants(matchId: string) {
    try {
      const participants = await this.prisma.matchParticipant.findMany({
        where: { matchId },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      });

      return participants;
    } catch (error) {
      this.logger.error(`Error getting participants for match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * End match and mark as done
   */
  async endMatch(matchId: string) {
    try {
      const match = await this.prisma.match.update({
        where: { id: matchId },
        data: { status: 'done' },
        include: {
          participants: {
            include: {
              member: true,
            },
          },
        },
      });

      this.logger.log(`Match ${matchId} ended`);
      return match;
    } catch (error) {
      this.logger.error(`Error ending match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Check if member joined match
   */
  async isMemberJoined(matchId: string, memberId: string): Promise<boolean> {
    try {
      const participant = await this.prisma.matchParticipant.findUnique({
        where: {
          matchId_memberId: {
            matchId,
            memberId,
          },
        },
      });

      return !!participant;
    } catch (error) {
      return false;
    }
  }
}
