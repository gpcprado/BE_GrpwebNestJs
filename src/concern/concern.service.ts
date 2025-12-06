import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface Concern {
  concern_id?: number; 
  username: string; 
  concern_content: string; 
  id: number; 
  sentTime?: Date | string;
}


@Injectable()
export class ConcernService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute('SELECT * FROM concern');
    return rows;
  }
  async getAll() {
    return this.findAll();
  }

  async delete(concern_id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM concern WHERE concern_id = ?', 
      [concern_id], 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Concern with ID ${concern_id} not found`);
    }
  }

  async createConcern(username: string, concern_content: string, id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO concern (username, concern_content, id) VALUES (?, ?, ?)',
      [username, concern_content, id ?? null]
    );
    
    return { 
      concern_id: (result as any).insertId,
      username: username, 
      concern_content: concern_content,
      id: id,
    } as Concern;
  }

  async findById(userId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, username, concern_content FROM concern WHERE id = ?', 
      [userId],
    );
    return rows[0];
  }

  async updateConcern(concern_id: number, data: { username?: string; concern_content?: string }) { 
    const { username, concern_content } = data; 

    const [result]: any = await this.pool().execute(
      'UPDATE concern SET username = ?, concern_content = ? WHERE concern_id = ?',
      [username, concern_content, concern_id] 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Message with ID ${concern_id} not found`); 
    }

    return { concern_id, username, concern_content } as Concern; 
  }
}