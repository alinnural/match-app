import { Controller, Get, Post, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('api/matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  /**
   * Create new match
   */
  @Post()
  async createMatch(
    @Body()
    body: {
      groupId: string;
      name: string;
      venue: string;
      matchDatetime: string;
      price?: number;
      maxParticipants?: number;
      createdById?: string;
    },
  ) {
    try {
      const match = await this.matchesService.createMatch({
        ...body,
        matchDatetime: new Date(body.matchDatetime),
      });
      return {
        success: true,
        data: match,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal membuat pertandingan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all matches in group
   */
  @Get('group/:groupId')
  async getGroupMatches(
    @Param('groupId') groupId: string,
  ) {
    try {
      const matches = await this.matchesService.getGroupMatches(groupId);
      return {
        success: true,
        data: matches,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil daftar pertandingan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get match details
   */
  @Get(':id')
  async getMatch(@Param('id') matchId: string) {
    try {
      const match = await this.matchesService.getMatchById(matchId);
      if (!match) {
        throw new HttpException(
          'Pertandingan tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: match,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Gagal mengambil detail pertandingan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Join match
   */
  @Post(':id/join')
  async joinMatch(
    @Param('id') matchId: string,
    @Body() body: { memberId: string },
  ) {
    try {
      const participant = await this.matchesService.addParticipant(
        matchId,
        body.memberId,
      );
      return {
        success: true,
        data: participant,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Gagal bergabung ke pertandingan',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Leave match
   */
  @Delete(':id/participants/:memberId')
  async leaveMatch(
    @Param('id') matchId: string,
    @Param('memberId') memberId: string,
  ) {
    try {
      await this.matchesService.removeParticipant(matchId, memberId);
      return {
        success: true,
        message: 'Berhasil keluar dari pertandingan',
      };
    } catch (error) {
      throw new HttpException(
        'Gagal keluar dari pertandingan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * End match
   */
  @Post(':id/end')
  async endMatch(@Param('id') matchId: string) {
    try {
      const match = await this.matchesService.endMatch(matchId);
      return {
        success: true,
        data: match,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengakhiri pertandingan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get match participants
   */
  @Get(':id/participants')
  async getParticipants(@Param('id') matchId: string) {
    try {
      const participants = await this.matchesService.getParticipants(matchId);
      return {
        success: true,
        data: participants,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil daftar peserta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
