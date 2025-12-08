import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req} from '@nestjs/common';
import { UserProfileService } from './userprofile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('userprofile')
export class UserProfileController {
  constructor(private readonly userprofileService: UserProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userprofileService.delete(id); 
    return {
      message: `userprofile deleted successfully.`,};
  }

  @UseGuards(JwtAuthGuard)
  @Get()
    async findAll() {
     const userprofile = await this.userprofileService.findAll();
     return userprofile;
    }

    @UseGuards(JwtAuthGuard)
   @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userprofileService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
    async create(
    @Req() req: ExpressRequest,
    @Body() Body: any
    ) {
      
      const {profileusername, full_name, phone_number, email, bio,} = Body;
      const userId = (req.user as any)?.id;
      
      return this.userprofileService.createUserProfile(profileusername, full_name, phone_number, email, bio, userId);
    }
    
  @Put(':id')
async update(
  @Param('id') id: number,
  @Body() data: { profileusername?: string, full_name?: string, phone_number?: string | null, email?: string, bio?: string },
) {
    const updatedUserProfile = await this.userprofileService.updateUserProfile(id, data); 

    return updatedUserProfile;
}
}