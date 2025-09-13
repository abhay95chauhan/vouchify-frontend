export interface IUserSessionGet {
  id: string;
  user_id?: string;
  token?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
  expires_at: string;
  revoked: boolean;
}
