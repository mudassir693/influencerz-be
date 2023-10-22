import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
