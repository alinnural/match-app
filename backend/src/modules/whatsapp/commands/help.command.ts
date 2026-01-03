import { Message } from 'whatsapp-web.js';
import { BaseCommand } from './base.command';
import { CommandHandlerService } from '../command-handler.service';

export class HelpCommand extends BaseCommand {
  name = 'help';
  aliases = ['h', 'bantuan'];
  description = 'Tampilkan semua perintah yang tersedia';
  usage = '/help';

  constructor(private commandHandler: CommandHandlerService) {
    super();
  }

  async execute(message: Message): Promise<void> {
    const commands = this.commandHandler.getAllCommands();

    let helpText = `
╔════════════════════════════════════════╗
║   🎯 MATCH SPORT BOT - HELP            ║
╚════════════════════════════════════════╝

📋 **DAFTAR PERINTAH:**

*Kelola Pertandingan:*
/newmatch - Buat pertandingan baru
/join - Bergabung ke pertandingan
/leave - Keluar dari pertandingan
/listmatch - Daftar pertandingan aktif
/status - Lihat detail pertandingan
/endmatch - Akhiri pertandingan & hitung tagihan

*Kelola Kas Grup:*
/kas - Lihat saldo kas grup
/historykas - Lihat riwayat transaksi kas

*Info:*
/help - Tampilkan pesan ini

─────────────────────────────────────

Ketik */${commands[0]?.name} /help* untuk detail perintah
    `;

    await message.reply(helpText);
  }
}
