import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface Application {
  application_id?: number;
  id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  applicant_address: string;
  application_date?: string; // MySQL DATETIME becomes a string in Node
  job_positions?: 'Cashier' | 'Accountant' | 'Security Guard'| 'Electrician' | 'Helper' | 'Editor' | 'Documentator';
  position_applied_for?: 'Unknown' | 'Full Time' | 'Part Time',
  status?: 'Pending Review' | 'Under Consideration' | 'Interview Scheduled' | 'Rejected' | 'Hired';
}


@Injectable()
export class ApplicationService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute('SELECT * FROM application');
    return rows;
  }
  async getAll() {
    return this.findAll();
  }

  async delete(application_id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM application WHERE application_id = ?', 
      [application_id], 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Application with ID ${application_id} not found`);
    }
  }

  async createApplication(
    applicant_name: string,
    applicant_email: string,
    applicant_phone: string | null,
    applicant_address: string,
    id: number
    ) { 
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO application (applicant_name, applicant_email, applicant_phone, applicant_address, id) VALUES (?, ?, ?, ?, ?)',
      [applicant_name, applicant_email, applicant_phone, applicant_address, id ?? null]
    );
    return { 
      application_id: (result as any).insertId,
      applicant_name: applicant_name,
      applicant_email: applicant_email,
      applicant_phone: applicant_phone,
      applicant_address: applicant_address,
      id: id,
    } as Application;
  }

  async findById(userId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, applicant_name, applicant_email, applicant_phone, applicant_address, application_date, job_positions, position_applied_for, status FROM application WHERE id = ?', 
      [userId],
    );
    return rows[0];
  }

  async updateApplication(application_id: number, data: { applicant_name?: string, applicant_email?: string, applicant_phone?: string | null, applicant_address?: string }) { 
    const { applicant_name, applicant_email, applicant_phone, applicant_address } = data; 

    const [result]: any = await this.pool().execute(
      'UPDATE application SET applicant_name = ?, applicant_email = ?, applicant_phone = ?, applicant_address = ? WHERE application_id = ?',
      [applicant_name, applicant_email, applicant_phone, applicant_address, application_id] 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Application with ID ${application_id} not found`); 
    }

    return { application_id, applicant_name, applicant_email, applicant_phone, applicant_address } as Application; 
  }
}