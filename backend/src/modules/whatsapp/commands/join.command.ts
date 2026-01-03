import { Message } from 'whatsapp-web.js';
import { BaseCommand } from './base.command';
import { MatchesService } from '../../matches/matches.service';
import { GroupsService } from '../../groups/groups.service';
import { Logger } from '@nestjs/common';

export class JoinCommand extends BaseCommand {
  name = 'join';
  aliases = ['j'];
  description = 'Bergabung ke pertandingan';
  usage = '/join <nomor_urut>';
  private readonly logger = new Logger(JoinCommand.name);

  constructor(
    private matchesService: MatchesService,
    private groupsService: GroupsService,
  ) {
    super();
  }

  async execute(message: Message, args: string[]): Promise<void> {
    try {
      // Get group and user
      const group = await this.groupsService.getGroupByWaGroupId(message.from);
      const contact = await message.getContact();

      // Get active matches
      const matches = await this.matchesService.getGroupMatches(group.id, 'open');

      if (matches.length === 0) {
        await message.reply(
          '❌ Tidak ada pertandingan aktif. Ketik /newmatch untuk membuat!',
        );
        return;
      }

      if (args.length === 0) {
        // Show list of matches
        let listText = '📋 **Daftar Pertandingan Aktif:**\n\n';
        matches.forEach((m, idx) => {
          listText += `${idx + 1}. **${m.name}** - ${m.venue}\n   💰 Rp ${m.price?.toLocaleString('id-ID') || '0'}\n   👥 ${m._count.participants || 0} peserta\n\n`;
        });
        listText += `Ketik */join <nomor>* untuk bergabung\nContoh: /join 1`;

        await message.reply(listText);
        return;
      }

      const matchNumber = parseInt(args[0]) - 1;
      if (isNaN(matchNumber) || matchNumber < 0 || matchNumber >= matches.length) {
        await message.reply(
          `❌ Nomor pertandingan tidak valid! Pilih antara 1-${matches.length}`,
        );
        return;
      }

      const selectedMatch = matches[matchNumber];

      // Check if already joined
      const isJoined = await this.matchesService.isMemberJoined(
        selectedMatch.id,
        contact.id.user,
      );

      if (isJoined) {
        await message.reply('❌ Anda sudah bergabung ke pertandingan ini!');
        return;
      }

      // Join match
      const participant = await this.matchesService.addParticipant(
        selectedMatch.id,
        contact.id.user,
      );

      await message.reply(`
✅ **Berhasil bergabung!**

📌 ${selectedMatch.name}
📍 ${selectedMatch.venue}
💰 Rp ${selectedMatch.price?.toLocaleString('id-ID') || '0'}

Ketik */status* untuk lihat detail pertandingan
Ketik */leave* untuk keluar dari pertandingan
      `);

      this.logger.log(`${contact.name} joined match: ${selectedMatch.name}`);
    } catch (error) {
      this.logger.error('Error joining match:', error);
      await message.reply('⚠️ Gagal bergabung. Coba lagi nanti!');
    }
  }
}
