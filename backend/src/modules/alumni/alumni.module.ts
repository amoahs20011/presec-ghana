import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumniProfile } from './alumni-profile.entity';
import { AlumniService } from './alumni.service';
import { AlumniController } from './alumni.controller';
import { YearGroupsModule } from '../year-groups/year-groups.module';
import { School } from '../schools/school.entity';
import { YearGroup } from '../year-groups/year-group.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlumniProfile, School, YearGroup, User]),
    YearGroupsModule,
  ],
  providers: [AlumniService],
  controllers: [AlumniController],
  exports: [AlumniService],
})
export class AlumniModule {}
