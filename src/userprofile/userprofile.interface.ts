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