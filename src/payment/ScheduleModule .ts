import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentService } from './payment.service';
import { PaymentModule } from './payment.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Asegúrate de incluir esta línea
    PaymentModule,
    // otros módulos...
  ],
})
export class Shedule {}
