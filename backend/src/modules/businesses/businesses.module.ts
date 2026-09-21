import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './business.entity';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, User])],
  providers: [BusinessesService],
  controllers: [BusinessesController],
  exports: [BusinessesService],
})
export class BusinessesModule {}
