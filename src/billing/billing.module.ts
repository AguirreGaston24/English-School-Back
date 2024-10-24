import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Billing, BillingSchema } from './entities/billing.entity';
import { StudentModule } from '../student/student.module'; // Asegúrate de importar el módulo

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Billing.name, schema: BillingSchema }]),
    StudentModule, // Importar StudentsModule aquí
  ],
  providers: [BillingService],
  controllers: [BillingController],
})
export class BillingModule {}
