import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

// ----------------------------------------------------
// NOTE: Ideally, put this in a separate file like message.interface.ts
export interface Message {
  message_id?: number; 
  message_code: string; 
  message_content: string; 
  id: number; 
  sentTime?: Date | string;
}
// ----------------------------------------------------


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

  // FIX 1: Renamed parameter to be consistent with the logic (message_id)
  async delete(message_id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM messages WHERE message_id = ?', // FIX: Corrected column name from messages_id to message_id
      [message_id], // FIX 2: Used the parameter 'message_id' instead of the undeclared variable
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Message with ID ${message_id} not found`);
    }
  }

  // FIX 3: Renamed method and parameters to match the table/entity name (messages)
  // FIX 4: Explicitly use variables defined as parameters to resolve shorthand errors
  async createMessage(message_code: string, message_content: string, id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO messages (message_code, message_content, id) VALUES (?, ?, ?)',
      [message_code, message_content, id ?? null]
    );
    
    // FIX 5: Used variables defined as parameters to resolve shorthand errors
    return { 
      message_id: (result as any).insertId,
      message_code: message_code, 
      message_content: message_content,
      id: id,
    } as Message;
  }

  // NOTE: This function's SQL selects from 'users' but the service is 'messages'. 
  // I kept the existing logic but you should verify this is what you intended.
  async findById(userId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, message_code, message_content FROM messages WHERE id = ?', 
      [userId],
    );
    return rows[0];
  }

  // FIX 6: Renamed method to be consistent (updateMessage) and used appropriate data parameter names
  async updateMessage(message_id: number, data: { message_code?: string; message_content?: string }) { 
    const { message_code, message_content } = data; // FIX 7: Destructured 'data' using correct property names

    const [result]: any = await this.pool().execute(
      'UPDATE messages SET message_code = ?, message_content = ? WHERE message_id = ?',
      [message_code, message_content, message_id] // FIX 8: Used the correct column names for values and the correct parameter 'message_id'
    );

    if (result.affectedRows === 0) {
      // FIX 9: Used the parameter 'message_id' instead of the undeclared variable
      throw new NotFoundException(`Message with ID ${message_id} not found`); 
    }

    // FIX 10: Returned object using correct, declared variables/parameters
    return { message_id, message_code, message_content } as Message; 
  }
}