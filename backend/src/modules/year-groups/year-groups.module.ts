import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YearGroup } from './year-group.entity';
import { YearGroupsService } from './year-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([YearGroup])],
  providers: [YearGroupsService],
  exports: [YearGroupsService],
})
export class YearGroupsModule {}
