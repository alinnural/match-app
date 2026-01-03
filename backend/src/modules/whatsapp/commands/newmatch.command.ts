import { Message } from 'whatsapp-web.js';
import { BaseCommand } from './base.command';
import { MatchesService } from '../../matches/matches.service';
import { GroupsService } from '../../groups/groups.service';
import { Logger } from '@nestjs/common';

export class NewMatchCommand extends BaseCommand {
  name = 'newmatch';
  aliases = ['nm', 'buatmatch'];
  description = 'Buat pertandingan baru';
  usage = '/newmatch <nama_olahraga> <venue> <harga_per_orang>';
  private readonly logger = new Logger(NewMatchCommand.name);

  constructor(
    private matchesService: MatchesService,
    private groupsService: GroupsService,
  ) {
    super();
  }

  async execute(message: Message, args: string[]): Promise<void> {
    try {
      if (args.length < 3) {
        await message.reply(`
❌ Format salah!

Cara pakai:
${this.usage}

Contoh:
/newmatch Futsal Lapangan Satrio 50000

Parameter:
- nama_olahraga: Jenis olahraga (Futsal, Badminton, dll)
- venue: Lokasi pertandingan
- harga_per_orang: Biaya per orang (dalam rupiah)
        `);
        return;
      }

      const nama = args[0];
      const venue = args[1];
      const hargaStr = args[2];

      // Validate price
      const harga = parseInt(hargaStr);
      if (isNaN(harga) || harga <= 0) {
        await message.reply('❌ Harga harus berupa angka positif');
        return;
      }

      // Get group and creator
      const group = await this.groupsService.getGroupByWaGroupId(message.from);
      const contact = await message.getContact();

      // Create match (30 minutes from now as default time)
      const matchDatetime = new Date();
      matchDatetime.setMinutes(matchDatetime.getMinutes() + 30);

      const match = await this.matchesService.createMatch({
        groupId: group.id,
        name: nama,
        venue: venue,
        matchDatetime: matchDatetime,
        price: harga,
      });

      // Auto-add creator as participant
      await this.matchesService.addParticipant(match.id, contact.id.user);

      await message.reply(`
✅ **Pertandingan Baru Dibuat!**

📌 **${match.name}**
📍 Lokasi: ${match.venue}
💰 Harga: Rp ${harga.toLocaleString('id-ID')}
🕐 Waktu: ${new Date(match.matchDatetime).toLocaleTimeString('id-ID')}
👥 Peserta: 1 orang (Anda)

Ketik */join* untuk bergabung ke pertandingan ini!
      `);

      this.logger.log(`New match created: ${nama} by ${contact.name}`);
    } catch (error) {
      this.logger.error('Error creating match:', error);
      await message.reply(
        '⚠️ Gagal membuat pertandingan. Coba lagi nanti!',
      );
    }
  }
}
