import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema, Students } from 'src/student/entities/student.entity';
import { Group, GroupSchema } from 'src/groups/entities/group.entity';
import { Teacher, TeacherSchema } from 'src/teacher/entities/teacher.entity';
import { Billing, BillingSchema } from 'src/billing/entities/billing.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Students.name,
        schema: StudentSchema
      },
      {
        name: Group.name,
        schema: GroupSchema
      },
      {
        name: Teacher.name,
        schema: TeacherSchema
      },
      {
        name: Billing.name,
        schema: BillingSchema
      }
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule { }
