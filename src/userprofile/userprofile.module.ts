import { Module, forwardRef } from '@nestjs/common';
import { UserProfileController } from './userprofile.controller';
import { UserProfileService } from './userprofile.service';;
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
