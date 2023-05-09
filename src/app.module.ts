import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZakazModule } from './zakaz/zakaz.module';

@Module({
  imports: [ZakazModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
