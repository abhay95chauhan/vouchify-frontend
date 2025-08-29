// dto/smtp/post-smtp.dto.ts
export interface ISmtpPost {
  enabled?: boolean;
  sender_email: string;
  sender_name: string;
  host: string;
  port: number;
  username: string;
  password: string; // plain string -> will be encrypted in backend
}

// dto/smtp/get-smtp.dto.ts
export interface ISmtpGet {
  id: string;
  enabled: boolean;
  sender_email: string;
  sender_name: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}
