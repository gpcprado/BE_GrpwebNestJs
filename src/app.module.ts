import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PositionsModule} from './positions/positions.module';
import {MessagesModule} from './messages/messages.module';
import {TasksModule} from './tasks/tasks.module';
import {ConcernModule} from './concern/concern.module';
import {ApplicationModule} from './application/application.module';

@Module({
  imports: [DatabaseModule, UsersModule, 
    AuthModule, PositionsModule, 
    MessagesModule, TasksModule, 
    ConcernModule, ApplicationModule],
})
export class AppModule {}