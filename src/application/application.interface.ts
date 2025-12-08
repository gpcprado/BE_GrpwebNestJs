export interface Application {
  application_id?: number;
  id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  applicant_address: string;
  application_date?: string; // MySQL DATETIME becomes a string in Node
  job_positions?: 'Unknown' | 'Cashier' | 'Accountant' | 'Security Guard'| 'Electrician' | 'Helper' | 'Editor' | 'Documentator';
  position_applied_for?: 'Unknown' | 'Full Time' | 'Part Time',
  status?: 'Pending Review' | 'Under Consideration' | 'Interview Scheduled' | 'Rejected' | 'Hired';
}
