import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('api/groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  /**
   * Get all groups / communities
   */
  @Get()
  async getAllGroups() {
    try {
      const groups = await this.groupsService.getAllGroups();
      return {
        success: true,
        data: groups,
        count: groups.length,
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengambil daftar komunitas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get single group details
   */
  @Get(':id')
  async getGroup(@Param('id') groupId: string) {
    try {
      const group = await this.groupsService.getGroupById(groupId);

      if (!group) {
        throw new HttpException(
          'Komunitas tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: group,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Gagal mengambil detail komunitas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get group statistics
   */
  @Get(':id/stats')
  async getGroupStats(@Param('id') groupId: string) {
    try {
      const stats = await this.groupsService.getGroupStats(groupId);

      if (!stats) {
        throw new HttpException(
          'Komunitas tidak ditemukan',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Gagal mengambil statistik komunitas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
