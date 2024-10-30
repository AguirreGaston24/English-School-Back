import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherModule } from 'src/teacher/teacher.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSquema } from './entities/payment.entity';
import { GroupsModule } from 'src/groups/groups.module'; 
import { BillingModule } from '../billing/billing.module';
import { StudentModule } from 'src/student/student.module'; // Importa el módulo de estudiantes

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSquema }]),
    TeacherModule,
    GroupsModule,
    BillingModule,
    StudentModule, // Importar el StudentModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService], // Ya no necesitas StudentService aquí
  exports: [PaymentService], // Ya no necesitas StudentService aquí

})
export class PaymentModule {}
