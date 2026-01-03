import { Message } from 'whatsapp-web.js';
import { ICommand } from '../interfaces/command.interface';

export abstract class BaseCommand implements ICommand {
  abstract name: string;
  abstract aliases: string[];
  abstract description: string;
  abstract usage: string;

  abstract execute(message: Message, args: string[]): Promise<void>;

  /**
   * Parse arguments from command
   */
  protected parseArgs(args: string[]): Record<string, string> {
    const parsed: Record<string, string> = {};
    args.forEach((arg, index) => {
      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        parsed[key] = args[index + 1] || '';
      }
    });
    return parsed;
  }

  /**
   * Format help text
   */
  protected getHelpText(): string {
    return `
📌 **${this.name.toUpperCase()}**
${this.description}

Cara pakai:
${this.usage}

Contoh:
${this.usage}
    `;
  }
}
