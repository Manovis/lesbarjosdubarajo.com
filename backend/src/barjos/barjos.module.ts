import { Module } from '@nestjs/common';
import { BarjosService } from './barjos.service';
import { BarjosController } from './barjos.controller';

@Module({
  controllers: [BarjosController],
  providers: [BarjosService],
  exports: [BarjosService], // Exporté au cas où d'autres modules en auraient besoin
})
export class BarjosModule {}