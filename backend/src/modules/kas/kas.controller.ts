import { Controller, Get, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { KasService } from './kas.service';

@Controller('api/kas')
export class KasController {
  constructor(private kasService: KasService) {}

  /**
   * Get group kas balance
   */
  @Get('groups/:groupId/balance')
  async getGroupBalance(@Param('groupId') groupId: string) {
    try {
      const balance = await this.kasService.getGroupKasBalance(groupId);
      return {
        success: true,
        data: balance,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil saldo kas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get kas transaction history
   */
  @Get('groups/:groupId/history')
  async getTransactionHistory(@Param('groupId') groupId: string) {
    try {
      const transactions = await this.kasService.getTransactionHistory(groupId);
      return {
        success: true,
        data: transactions,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil riwayat transaksi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Record kas transaction
   */
  @Post('transaction')
  async recordTransaction(
    @Body()
    body: {
      groupId: string;
      type: 'income' | 'expense';
      amount: number;
      description?: string;
      matchId?: string;
    },
  ) {
    try {
      const transaction = await this.kasService.recordTransaction(body);
      return {
        success: true,
        data: transaction,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mencatat transaksi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calculate settlement for match
   */
  @Get('matches/:matchId/settlement')
  async calculateSettlement(@Param('matchId') matchId: string) {
    try {
      // Note: groupId should be extracted from match
      const settlement = await this.kasService.calculateSettlement('', matchId);
      return {
        success: true,
        data: settlement,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal menghitung pembagian biaya',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Apply settlement (end match and calculate bills)
   */
  @Post('matches/:matchId/apply-settlement')
  async applySettlement(
    @Param('matchId') matchId: string,
    @Body() body: { groupId: string; adminId?: string },
  ) {
    try {
      const result = await this.kasService.applySettlement(
        body.groupId,
        matchId,
        body.adminId,
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal menerapkan pembagian biaya',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get group members
   */
  @Get('groups/:groupId/members')
  async getGroupMembers(@Param('groupId') groupId: string) {
    try {
      const members = await this.kasService.getGroupMembersBalance(groupId);
      return {
        success: true,
        data: members,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil daftar anggota',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Reset group kas balance (admin only)
   */
  @Post('groups/:groupId/reset')
  async resetBalance(@Param('groupId') groupId: string) {
    try {
      const result = await this.kasService.resetGroupBalance(groupId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mereset saldo kas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
