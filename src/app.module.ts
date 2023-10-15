import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {MulterModule} from '@nestjs/platform-express'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './modules/images/images.module';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
