import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('api/whatsapp')
export class WhatsappController {
  constructor(private whatsappService: WhatsappService) {}

  /**
   * Get QR Code for scanning
   * Returns null if bot is already connected
   */
  @Get('qr')
  async getQR() {
    const qrCode = await this.whatsappService.getQRCode();
    return {
      qrCode, // base64 data URL or null
      status: qrCode ? 'waiting_scan' : 'already_connected',
      message: qrCode
        ? '📱 Scan dengan WhatsApp Anda'
        : '✅ Bot sudah terhubung',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check bot connection status
   */
  @Get('status')
  async getStatus() {
    const isConnected = await this.whatsappService.isConnected();
    const info = await this.whatsappService.getInfo();

    return {
      ready: isConnected,
      connected: isConnected,
      message: isConnected ? 'Bot terhubung ke WhatsApp' : 'Bot belum terhubung',
      info,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Send test message to group (for testing only)
   */
  @Post('send-message')
  async sendMessage(@Body() body: { groupId: string; message: string }) {
    if (!body.groupId || !body.message) {
      throw new HttpException(
        'groupId and message are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.whatsappService.sendMessage(body.groupId, body.message);
      return {
        success: true,
        message: 'Pesan terkirim',
      };
    } catch (error) {
      throw new HttpException(
        'Gagal mengirim pesan: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Test WhatsApp command locally (for development testing)
   * Simulates a WhatsApp message and processes it through the command handler
   */
  @Post('test-command')
  async testCommand(
    @Body() body: { command: string; args?: string[]; groupId?: string },
  ) {
    if (!body.command) {
      throw new HttpException(
        'command is required (e.g., "newmatch", "help", "listmatch")',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.whatsappService.executeTestCommand(
        body.command,
        body.args || [],
        body.groupId || 'test-group-123',
      );

      return {
        success: true,
        command: body.command,
        args: body.args || [],
        result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
