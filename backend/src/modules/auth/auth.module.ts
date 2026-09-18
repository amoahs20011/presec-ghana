import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

const jwtOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'change_me',
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  },
};

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register(jwtOptions),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
