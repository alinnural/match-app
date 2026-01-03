import { Message } from 'whatsapp-web.js';
import { BaseCommand } from './base.command';
import { MatchesService } from '../../matches/matches.service';
import { GroupsService } from '../../groups/groups.service';
import { Logger } from '@nestjs/common';

export class ListMatchCommand extends BaseCommand {
  name = 'listmatch';
  aliases = ['lm', 'daftarmatch'];
  description = 'Lihat daftar semua pertandingan';
  usage = '/listmatch';
  private readonly logger = new Logger(ListMatchCommand.name);

  constructor(
    private matchesService: MatchesService,
    private groupsService: GroupsService,
  ) {
    super();
  }

  async execute(message: Message): Promise<void> {
    try {
      const group = await this.groupsService.getGroupByWaGroupId(message.from);
      const matches = await this.matchesService.getGroupMatches(group.id);

      if (matches.length === 0) {
        await message.reply(
          '📭 Belum ada pertandingan. Ketik /newmatch untuk membuat!',
        );
        return;
      }

      const activeMatches = matches.filter((m) => m.status === 'open');
      const doneMatches = matches.filter((m) => m.status === 'done');

      let listText = '📋 **Daftar Pertandingan**\n\n';

      if (activeMatches.length > 0) {
        listText += '🟢 **Aktif:**\n';
        activeMatches.forEach((m, idx) => {
          const price = m.price ? Number(m.price).toLocaleString('id-ID') : '0';
          listText += `${idx + 1}. **${m.name}**\n   📍 ${m.venue}\n   💰 Rp ${price}\n   👥 ${m._count.participants} peserta\n\n`;
        });
      }

      if (doneMatches.length > 0) {
        listText += '\n✅ **Selesai:**\n';
        doneMatches.slice(0, 5).forEach((m) => {
          listText += `• ${m.name} - ${m.venue}\n`;
        });
      }

      await message.reply(listText);
      this.logger.log(`Listed matches for group ${group.id}`);
    } catch (error) {
      this.logger.error('Error listing matches:', error);
      await message.reply('⚠️ Gagal mengambil daftar pertandingan!');
    }
  }
}
