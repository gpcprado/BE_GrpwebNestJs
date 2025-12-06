import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.tasksService.delete(id); 
    return {
      message: `tasks deleted successfully.`,};
  }

  @UseGuards(JwtAuthGuard)
  @Get()
    async findAll() {
     const tasks = await this.tasksService.findAll();
     return tasks;

    }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.tasksService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
    async create(
    @Req() req: ExpressRequest,
    @Body() Body: any
    ) {
      
      const { task_name, task_content,} = Body;
      const userId = (req.user as any)?.id;
      
      return this.tasksService.createTasks(task_name, task_content, userId);
    }
    
  @Put(':id')
async update(
  @Param('id') id: number,
  @Body() data: { task_name?: string; task_content?: string },
) {
    const updatedTasks = await this.tasksService.updateTasks(id, data); 

    return updatedTasks;
}
}