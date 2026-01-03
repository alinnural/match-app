import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'whatsapp-web.js';
import { GroupsService } from '../groups/groups.service';
import { ICommand, CommandContext } from './interfaces/command.interface';

@Injectable()
export class CommandHandlerService {
  private commands: Map<string, ICommand> = new Map();
  private readonly logger = new Logger(CommandHandlerService.name);
  private readonly COMMAND_PREFIX = '/';

  constructor(private groupsService: GroupsService) {}

  /**
   * Register a command
   */
  registerCommand(command: ICommand): void {
    this.commands.set(command.name.toLowerCase(), command);
    command.aliases.forEach((alias) => {
      this.commands.set(alias.toLowerCase(), command);
    });
    this.logger.log(`Command registered: ${command.name}`);
  }

  /**
   * Register multiple commands
   */
  registerCommands(commands: ICommand[]): void {
    commands.forEach((cmd) => this.registerCommand(cmd));
  }

  /**
   * Parse and handle incoming message
   */
  async handleMessage(message: Message): Promise<boolean> {
    // Only process group messages
    if (!message.from.includes('@g.us')) {
      return false;
    }

    // Check if message starts with command prefix
    if (!message.body.startsWith(this.COMMAND_PREFIX)) {
      return false;
    }

    try {
      const [commandName, ...args] = message.body
        .slice(this.COMMAND_PREFIX.length)
        .split(' ');

      const command = this.commands.get(commandName.toLowerCase());

      if (!command) {
        await message.reply(
          `❌ Perintah tidak ditemukan: /${commandName}\n\nKetik /help untuk melihat semua perintah`,
        );
        return true;
      }

      // Get group info
      const group = await this.groupsService.getGroupByWaGroupId(message.from);
      const contact = await message.getContact();

      const context: CommandContext = {
        message,
        groupId: group.id,
        userId: contact.id.user,
        userName: contact.name || contact.pushname || 'User',
        args,
      };

      this.logger.log(
        `Command executed: /${commandName} by ${context.userName} in ${group.name}`,
      );

      await command.execute(message, args);
      return true;
    } catch (error) {
      this.logger.error('Error handling command:', error);
      await message.reply('⚠️ Terjadi kesalahan saat memproses perintah');
      return true;
    }
  }

  /**
   * Get command by name
   */
  getCommand(name: string): ICommand | undefined {
    return this.commands.get(name.toLowerCase());
  }

  /**
   * Get all commands
   */
  getAllCommands(): ICommand[] {
    const uniqueCommands = new Map<string, ICommand>();
    this.commands.forEach((cmd) => {
      uniqueCommands.set(cmd.name, cmd);
    });
    return Array.from(uniqueCommands.values());
  }
}
