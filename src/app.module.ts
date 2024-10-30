import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { StudentModule } from './student/student.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AssistsModule } from './assists/assists.module';
import { TeacherModule } from './teacher/teacher.module';
import { GroupsModule } from './groups/groups.module';
import { StatsModule } from './stats/stats.module';
import { BillingModule } from './billing/billing.module';
import { PaymentModule } from './payment/payment.module';
import { Shedule } from './payment/ScheduleModule ';
import { envs } from './config/envs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(envs.DATABASE_URL),   
    AuthModule,
    StudentModule,
    AssistsModule,
    TeacherModule,
    GroupsModule,
    StatsModule,
    BillingModule,
    PaymentModule,
    Shedule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
