import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth, Events } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import { CommandHandlerService } from './command-handler.service';
import { MatchesService } from '../matches/matches.service';
import { GroupsService } from '../groups/groups.service';
// Import commands
import { HelpCommand } from './commands/help.command';
import { NewMatchCommand } from './commands/newmatch.command';
import { JoinCommand } from './commands/join.command';
import { ListMatchCommand } from './commands/listmatch.command';
import { LeaveCommand } from './commands/leave.command';

@Injectable()
export class WhatsappService {
  private client: Client | null = null;
  private qrCode: string | null = null;
  private isReady = false;
  private readonly logger = new Logger(WhatsappService.name);
  private commandsRegistered = false;

  constructor(
    private configService: ConfigService,
    private commandHandler: CommandHandlerService,
    private matchesService: MatchesService,
    private groupsService: GroupsService,
  ) {
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
          executablePath: process.env.CHROME_PATH,
        },
      });

      this.setupEventHandlers();
      this.client.initialize().catch((err) => {
        this.logger.error('Failed to initialize WhatsApp client:', err.message);
        this.useDemoMode();
      });
    } catch (error) {
      this.logger.error('Error creating WhatsApp client:', error);
      this.useDemoMode();
    }
  }

  private useDemoMode() {
    this.logger.warn('⚠️ Running in DEMO MODE - Install Chromium for production use');
    this.logger.warn('To fix: npm install puppeteer OR set CHROME_PATH env variable');
    setTimeout(() => {
      this.isReady = true;
      this.registerCommands();
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
      this.qrCode = null;
      this.registerCommands();
      this.logger.log('✅ WhatsApp Bot Connected!');
    });

    // Message received
    this.client.on(Events.MESSAGE_RECEIVED, async (msg) => {
      try {
        // Handle commands
        await this.commandHandler.handleMessage(msg);
      } catch (error) {
        this.logger.error('Error handling message:', error);
      }
    });

    // Bot disconnected
    this.client.on(Events.DISCONNECTED, () => {
      this.isReady = false;
      this.logger.warn('⚠️ WhatsApp Bot Disconnected');
    });
  }

  /**
   * Register all commands
   */
  private registerCommands() {
    if (this.commandsRegistered) return;

    try {
      const commands = [
        new HelpCommand(this.commandHandler),
        new NewMatchCommand(this.matchesService, this.groupsService),
        new JoinCommand(this.matchesService, this.groupsService),
        new ListMatchCommand(this.matchesService, this.groupsService),
        new LeaveCommand(this.matchesService, this.groupsService),
      ];

      this.commandHandler.registerCommands(commands);
      this.commandsRegistered = true;
      this.logger.log(`✅ ${commands.length} commands registered`);
    } catch (error) {
      this.logger.error('Error registering commands:', error);
    }
  }

  async getQRCode(): Promise<string | null> {
    if (this.isReady) {
      return null;
    }

    if (!this.qrCode && !this.client) {
      try {
        this.qrCode = await qrcode.toDataURL('DEMO_MODE_READY_TO_SCAN');
      } catch (error) {
        this.logger.error('Failed to generate demo QR code', error);
      }
    }

    return this.qrCode;
  }

  async isConnected(): Promise<boolean> {
    return this.isReady;
  }

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

  getClient(): Client | null {
    return this.client;
  }

  getCommandHandler(): CommandHandlerService {
    return this.commandHandler;
  }

  /**
   * Execute test command locally (for development testing)
   * Simulates a WhatsApp message without needing actual WhatsApp connection
   */
  async executeTestCommand(
    command: string,
    args: string[] = [],
    groupId: string = 'test-group-123',
  ): Promise<string> {
    try {
      // Ensure commands are registered
      if (!this.commandsRegistered) {
        this.registerCommands();
      }

      // Build command string
      const commandStr = `/${command}${args.length > 0 ? ' ' + args.join(' ') : ''}`;

      this.logger.log(`🧪 Testing command: ${commandStr} (Group: ${groupId})`);

      // Create mock message object
      const mockMessage = {
        body: commandStr,
        from: `${groupId}@g.us`,
        getChat: async () => ({
          id: groupId,
          isGroup: true,
          name: 'Test Group',
        }),
        reply: async (text: string) => {
          this.logger.log(`📨 Bot Response: ${text}`);
          return {
            id: Math.random().toString(),
            timestamp: Date.now(),
            body: text,
            from: 'bot@whatsapp.com',
          };
        },
      } as any;

      // Execute through command handler
      const result = await this.commandHandler.handleMessage(mockMessage);

      return result || `✅ Command "${command}" executed successfully`;
    } catch (error) {
      this.logger.error(`Error executing test command: ${error.message}`);
      throw new Error(`Failed to execute command: ${error.message}`);
    }
  }
}
