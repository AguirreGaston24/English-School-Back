import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Students, StudentSchema } from 'src/student/entities/student.entity';
import { Teacher, TeacherSchema } from 'src/teacher/entities/teacher.entity';
import { Group, GroupSchema } from 'src/groups/entities/group.entity';
import { Billing, BillingSchema } from 'src/billing/entities/billing.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Students.name,
        schema: StudentSchema
      },
      {
        name: Teacher.name,
        schema: TeacherSchema
      },
      {
        name: Group.name,
        schema: GroupSchema
      },
      {
        name: Billing.name,
        schema: BillingSchema
      }
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
