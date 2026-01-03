import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { CommandHandlerService } from './command-handler.service';
import { MatchesModule } from '../matches/matches.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [MatchesModule, GroupsModule],
  providers: [WhatsappService, CommandHandlerService],
  controllers: [WhatsappController],
  exports: [WhatsappService, CommandHandlerService],
})
export class WhatsappModule {}
