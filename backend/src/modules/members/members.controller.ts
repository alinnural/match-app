import { Controller, Get, Patch, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('api/members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  /**
   * Get all members in group
   */
  @Get('group/:groupId')
  async getGroupMembers(@Param('groupId') groupId: string) {
    try {
      const members = await this.membersService.getGroupMembers(groupId);
      return {
        success: true,
        data: members,
        count: members.length,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil daftar anggota',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get member details
   */
  @Get(':id')
  async getMember(@Param('id') memberId: string) {
    try {
      const member = await this.membersService.getMemberById(memberId);
      if (!member) {
        throw new HttpException(
          'Anggota tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: member,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Gagal mengambil detail anggota',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get member statistics
   */
  @Get(':id/stats')
  async getMemberStats(@Param('id') memberId: string) {
    try {
      const stats = await this.membersService.getMemberStats(memberId);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil statistik anggota',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update member
   */
  @Patch(':id')
  async updateMember(
    @Param('id') memberId: string,
    @Body() body: { name?: string; phone?: string; role?: string },
  ) {
    try {
      const member = await this.membersService.updateMember(memberId, body);
      return {
        success: true,
        data: member,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengubah data anggota',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove member from group
   */
  @Delete(':id')
  async removeMember(@Param('id') memberId: string) {
    try {
      await this.membersService.removeMember(memberId);
      return {
        success: true,
        message: 'Anggota berhasil dihapus',
      };
    } catch (error) {
      throw new HttpException(
        'Gagal menghapus anggota',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
