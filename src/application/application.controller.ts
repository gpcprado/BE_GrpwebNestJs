import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.applicationService.delete(id); 
    return {
      message: `application deleted successfully.`,};
  }

  @UseGuards(JwtAuthGuard)
  @Get()
    async findAll() {
     const application = await this.applicationService.findAll();
     return application;
    }

    @UseGuards(JwtAuthGuard)
   @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.applicationService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
    async create(
    @Req() req: ExpressRequest,
    @Body() Body: any
    ) {
      
      const { applicant_name, applicant_email, applicant_phone, applicant_address, job_positions, position_applied_for} = Body;
      const userId = (req.user as any)?.id;
      
      return this.applicationService.createApplication(applicant_name, applicant_email, applicant_phone, applicant_address, job_positions, position_applied_for, userId);
    }
    
  @Put(':id')
async update(
  @Param('id') id: number,
  @Body() data: { applicant_name?: string, applicant_email?: string, applicant_phone?: string | null, applicant_address?: string },
) {
    const updatedApplication = await this.applicationService.updateApplication(id, data); 

    return updatedApplication;
}
}
