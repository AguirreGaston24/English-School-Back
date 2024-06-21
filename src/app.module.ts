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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    StudentModule,
    AssistsModule,
    TeacherModule,
    GroupsModule,
    StatsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
