import { Message } from 'whatsapp-web.js';

export interface ICommand {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  execute(message: Message, args: string[]): Promise<void>;
}

export interface CommandContext {
  message: Message;
  groupId: string;
  userId: string;
  userName: string;
  args: string[];
}
