import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Contribution } from './contribution.entity';
import { ProjectUpdate } from './project-update.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { School } from '../schools/school.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Contribution,
      ProjectUpdate,
      School,
      User,
    ]),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
