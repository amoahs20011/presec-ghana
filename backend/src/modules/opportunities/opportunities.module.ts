import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './opportunity.entity';
import { OpportunityApplication } from './opportunity-application.entity';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { School } from '../schools/school.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Opportunity,
      OpportunityApplication,
      School,
      User,
    ]),
  ],
  providers: [OpportunitiesService],
  controllers: [OpportunitiesController],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
