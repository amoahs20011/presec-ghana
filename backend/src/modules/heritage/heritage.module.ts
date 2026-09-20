import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeritageItem } from './heritage-item.entity';
import { Achievement } from './achievement.entity';
import { HeritageService } from './heritage.service';
import { HeritageController } from './heritage.controller';
import { School } from '../schools/school.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeritageItem, Achievement, School, User])],
  providers: [HeritageService],
  controllers: [HeritageController],
  exports: [HeritageService],
})
export class HeritageModule {}
