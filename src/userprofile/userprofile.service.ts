import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface UserProfile {
  userprofile_id?: number;
  id: number;
  profileusername: string;
  full_name: string;
  phone_number: string | null;
  email: string;
  bio: string;
  created_at?: string;
  status?: 'Active' | 'Not Active' | 'Busy';
}


@Injectable()
export class UserProfileService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute('SELECT * FROM userprofile');
    return rows;
  }
  async getAll() {
    return this.findAll();
  }

  async delete(userprofile_id: number) { 
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM userprofile WHERE userprofile_id = ?', 
      [userprofile_id], 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Application with ID ${userprofile_id} not found`);
    }
  }

  async createUserProfile(
    profileusername: string,
    full_name: string,
    phone_number: string | null,
    email: string,
    bio: string,
    id: number
    ) { 
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO userprofile (profileusername, full_name, phone_number, email, bio, id) VALUES (?, ?, ?, ?, ?, ?)',
      [profileusername, full_name, phone_number, email, bio, id ?? null]
    );
    return { 
      userprofile_id: (result as any).insertId,
      profileusername: profileusername,
      full_name: full_name,
      phone_number: phone_number,
      email: email,
      bio: bio,
      id: id,
    } as UserProfile;
  }

  async findById(userId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, profileusername, full_name, phone_number, email, bio, status FROM userprofile WHERE id = ?', 
      [userId],
    );
    return rows[0];
  }

  async updateUserProfile(userprofile_id: number, data: { profileusername?: string, full_name?: string, phone_number?: string | null, email?: string, bio?: string, status?: null}) { 
    const { profileusername, full_name, phone_number, email, bio, status } = data; 

    const [result]: any = await this.pool().execute(
      'UPDATE userprofile SET profileusername = ?, full_name = ?, phone_number = ?, email = ?, bio = ?, status = ? WHERE userprofile_id = ?',
      [profileusername, full_name, phone_number, email, bio, status, userprofile_id] 
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`UserProfile with ID ${userprofile_id} not found`); 
    }

    return { userprofile_id, profileusername, full_name, phone_number, email, bio, status, } as UserProfile; 
  }
}