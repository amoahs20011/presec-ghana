import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { School } from '../schools/school.entity';
import { YearGroup } from '../year-groups/year-group.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventRegistration,
      School,
      YearGroup,
      User,
    ]),
  ],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
