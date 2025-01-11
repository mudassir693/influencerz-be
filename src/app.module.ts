import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './modules/images/images.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './modules/passport/strateges/local.strategy';
import { JwtStrategy } from './modules/passport/strateges/jwt.strategy';
import {MailModule} from './mail/mail.module'
import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ImagesModule,
    AuthModule,
    UserModule,
    AccountModule,
    MailModule,
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule {}


// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     ImagesModule,
//     AuthModule,
//     UserModule,
//     AccountModule,
//     MailModule,
//     JwtModule.register({
//       global:true,
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: '30d' },
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService, LocalStrategy, JwtStrategy],
// })
