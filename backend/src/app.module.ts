import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BarjosModule } from './barjos/barjos.module';

@Module({
  imports: [BarjosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
