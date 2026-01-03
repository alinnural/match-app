import { Module } from '@nestjs/common';
import { KasService } from './kas.service';
import { KasController } from './kas.controller';

@Module({
  providers: [KasService],
  controllers: [KasController],
  exports: [KasService],
})
export class KasModule {}
