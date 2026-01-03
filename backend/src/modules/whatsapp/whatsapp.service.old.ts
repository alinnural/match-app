import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth, Events } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import * as path from 'path';

@Injectable()
export class WhatsappService {
  private client: Client | null = null;
  private qrCode: string | null = null;
  private isReady = false;
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private configService: ConfigService) {
    this.initialize();
  }

  private initialize() {
    const sessionPath = this.configService.get<string>('whatsapp.sessionPath');

    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'match-app',
          dataPath: sessionPath,
        }),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          executablePath: process.env.CHROME_PATH, // Optional: custom Chrome path
        },
      });

      this.setupEventHandlers();
      this.client.initialize().catch((err) => {
        this.logger.error('Failed to initialize WhatsApp client:', err.message);
        // For development: use demo mode
        this.useDemoMode();
      });
    } catch (error) {
      this.logger.error('Error creating WhatsApp client:', error);
      // For development: use demo mode
      this.useDemoMode();
    }
  }

  private useDemoMode() {
    this.logger.warn('⚠️ Running in DEMO MODE - Install Chromium for production use');
    this.logger.warn('To fix: npm install puppeteer OR set CHROME_PATH env variable');
    // Simulate bot ready for demo
    setTimeout(() => {
      this.isReady = true;
      this.logger.log('✅ Demo Mode: WhatsApp Bot Ready (Mock)');
    }, 1000);
  }

  private setupEventHandlers() {
    if (!this.client) return;

    // QR Code generated
    this.client.on(Events.QR_RECEIVED, async (qr: string) => {
      this.logger.log('📱 QR Code Generated - Ready to scan');
      try {
        this.qrCode = await qrcode.toDataURL(qr);
      } catch (error) {
        this.logger.error('Failed to generate QR code', error);
      }
    });

    // Bot ready
    this.client.on(Events.READY, () => {
      this.isReady = true;
      this.qrCode = null; // Clear QR code after login
      this.logger.log('✅ WhatsApp Bot Connected!');
    });

    // Message received
    this.client.on(Events.MESSAGE_RECEIVED, (msg) => {
      this.logger.debug(`Message from ${msg.from}: ${msg.body}`);
    });

    // Bot disconnected
    this.client.on(Events.DISCONNECTED, () => {
      this.isReady = false;
      this.logger.warn('⚠️ WhatsApp Bot Disconnected');
    });
  }

  /**
   * Get current QR code as base64 data URL
   */
  async getQRCode(): Promise<string | null> {
    // If already ready, no QR code needed
    if (this.isReady) {
      return null;
    }

    // Generate demo QR code if in demo mode and no QR code yet
    if (!this.qrCode && !this.client) {
      try {
        this.qrCode = await qrcode.toDataURL('DEMO_MODE_READY_TO_SCAN');
      } catch (error) {
        this.logger.error('Failed to generate demo QR code', error);
      }
    }

    return this.qrCode;
  }

  /**
   * Get bot connection status
   */
  async isConnected(): Promise<boolean> {
    return this.isReady;
  }

  /**
   * Get bot info
   */
  async getInfo() {
    if (!this.client) {
      return null;
    }
    try {
      return await this.client.getWWebVersion();
    } catch (error) {
      this.logger.error('Failed to get bot info', error);
      return null;
    }
  }

  /**
   * Send message to group (for testing)
   */
  async sendMessage(groupId: string, message: string) {
    if (!this.client || !this.isReady) {
      throw new Error('Bot is not connected');
    }
    try {
      await this.client.sendMessage(groupId, message);
      this.logger.log(`Message sent to ${groupId}`);
    } catch (error) {
      this.logger.error(`Failed to send message to ${groupId}`, error);
      throw error;
    }
  }

  /**
   * Get client instance (for other modules)
   */
  getClient(): Client | null {
    return this.client;
  }
}
