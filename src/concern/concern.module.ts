import { Module, forwardRef } from '@nestjs/common';
import { ConcernController } from './concern.controller';
import { ConcernService } from './concern.service';;
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ConcernController],
  providers: [ConcernService],
  exports: [ConcernService],
})
export class ConcernModule {}
