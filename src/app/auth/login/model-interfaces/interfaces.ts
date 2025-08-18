import { IOrganizationGet } from '@/app/(modules)/[organization-slug]/model-interface/interfaces';

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: string;
  phone_number: string;
  avatar_url: string;
  is_active: boolean;
  is_email_varified: boolean;
  organization_id: string;
  joined_at: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  organization: IOrganizationGet;
}
