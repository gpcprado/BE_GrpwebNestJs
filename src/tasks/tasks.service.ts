import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface Tasks {
  task_id?: number; 
  tasks_name: string; 
  task_content: string; 
  id: number; 
  TaskDate?: Date | string;
}

@Injectable()
export class TasksService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute('SELECT * FROM tasks');
    return rows;
  }
  async getAll() {
    return this.findAll();
  }
  
  async delete(task_id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM tasks WHERE task_id = ?', 
      [task_id], 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Tasks with ID ${task_id} not found`);
    }
  }

  async createTasks(task_name: string, task_content: string, id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO tasks (task_name, task_content, id) VALUES (?, ?, ?)',
      [task_name, task_content, id ?? null]
    );

    return { 
      task_id: (result as any).insertId,
      task_name,
      task_content,
      id
    };
  }

  async findById(userId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT task_id, task_name, task_content, id, created_at, updated_at FROM tasks WHERE id = ?', 
      [userId],
    );
    return rows[0];
  }

  async updateTasks(task_id: number, data: { task_name?: string; task_content?: string }) { 
    const { task_name, task_content } = data; 

    const [result]: any = await this.pool().execute(
      'UPDATE tasks SET task_name = ?, task_content = ? WHERE task_id = ?',
      [task_name, task_content, task_id]
    );
    if (result.affectedRows === 0) {
      throw new NotFoundException(`Message with ID ${task_id} not found`); 
    }
    return {task_id, task_name, task_content }; 
  }
}