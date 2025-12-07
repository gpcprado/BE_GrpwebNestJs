import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface Message {
  message_id?: number; 
  message_code: string; 
  message_content: string; 
  id: number; 
  sentTime?: Date | string;
}

@Injectable()
export class MessagesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute('SELECT * FROM messages');
    return rows;
  }
  async getAll() {
    return this.findAll();
  }

  async delete(message_id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM messages WHERE message_id = ?', 
      [message_id], 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Message with ID ${message_id} not found`);
    }
  }

  async createMessage(message_code: string, message_content: string, id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO messages (message_code, message_content, id) VALUES (?, ?, ?)',
      [message_code, message_content, id ?? null]
    );
    
    return { 
      message_id: (result as any).insertId,
      message_code: message_code, 
      message_content: message_content,
      id: id,
    } as Message;
  }

  async findById(userId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, message_code, message_content FROM messages WHERE id = ?', 
      [userId],
    );
    return rows[0];
  }

  async updateMessage(message_id: number, data: { message_code?: string; message_content?: string }) { 
    const { message_code, message_content } = data; 
    const [result]: any = await this.pool().execute(
      'UPDATE messages SET message_code = ?, message_content = ? WHERE message_id = ?',
      [message_code, message_content, message_id]
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Message with ID ${message_id} not found`); 
    }
    return { message_id, message_code, message_content } as Message; 
  }
}