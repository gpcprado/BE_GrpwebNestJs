import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    // NOTE: The service method name 'delete' is already consistent and correct.
    await this.messagesService.delete(id); 
    return {
      message: `messages deleted successfully.`,};
  }

  @UseGuards(JwtAuthGuard)
  @Get()
    async findAll() {
     const messages = await this.messagesService.findAll();
     return messages;
    }

    @UseGuards(JwtAuthGuard)
   @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.messagesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
    async create(
    @Req() req: ExpressRequest,
    @Body() Body: any
    ) {
      
      const { message_code, message_content } = Body;
      const userId = (req.user as any)?.id;
      
      // FIX 1: Changed 'createMessages' to 'createMessage' to match the service
      return this.messagesService.createMessage(message_code, message_content, userId);
    }
    
  @Put(':id')
async update(
  @Param('id') id: number,
  @Body() data: { message_code?: string; message_content?: string },
) {
    // FIX 2: Changed 'update' to 'updateMessage' to match the service
    const updatedMessages = await this.messagesService.updateMessage(id, data); 

    return updatedMessages;
}
}