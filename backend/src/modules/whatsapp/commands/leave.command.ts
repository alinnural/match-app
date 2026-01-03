import { Message } from 'whatsapp-web.js';
import { BaseCommand } from './base.command';
import { MatchesService } from '../../matches/matches.service';
import { GroupsService } from '../../groups/groups.service';
import { Logger } from '@nestjs/common';

export class LeaveCommand extends BaseCommand {
  name = 'leave';
  aliases = ['l', 'keluar'];
  description = 'Keluar dari pertandingan';
  usage = '/leave';
  private readonly logger = new Logger(LeaveCommand.name);

  constructor(
    private matchesService: MatchesService,
    private groupsService: GroupsService,
  ) {
    super();
  }

  async execute(message: Message): Promise<void> {
    try {
      const group = await this.groupsService.getGroupByWaGroupId(message.from);
      const contact = await message.getContact();
      const userId = contact.id.user;

      // Get active matches
      const matches = await this.matchesService.getGroupMatches(group.id, 'open');

      if (matches.length === 0) {
        await message.reply('❌ Tidak ada pertandingan aktif untuk diikuti!');
        return;
      }

      // Find matches user joined
      const joinedMatches = [];
      for (const match of matches) {
        const isJoined = await this.matchesService.isMemberJoined(match.id, userId);
        if (isJoined) {
          joinedMatches.push(match);
        }
      }

      if (joinedMatches.length === 0) {
        await message.reply('❌ Anda tidak bergabung ke pertandingan manapun!');
        return;
      }

      // If only one match, auto-leave
      if (joinedMatches.length === 1) {
        await this.matchesService.removeParticipant(joinedMatches[0].id, userId);
        await message.reply(`
✅ **Berhasil keluar dari pertandingan!**

${joinedMatches[0].name} - ${joinedMatches[0].venue}
        `);
        this.logger.log(`${contact.name} left match: ${joinedMatches[0].name}`);
        return;
      }

      // Show list to choose
      let listText = '📋 **Pilih pertandingan untuk dikeluar:**\n\n';
      joinedMatches.forEach((m, idx) => {
        listText += `${idx + 1}. ${m.name} - ${m.venue}\n`;
      });
      listText += `\nKetik */leave <nomor>* untuk keluar\nContoh: /leave 1`;

      await message.reply(listText);
    } catch (error) {
      this.logger.error('Error leaving match:', error);
      await message.reply('⚠️ Gagal keluar dari pertandingan!');
    }
  }
}
