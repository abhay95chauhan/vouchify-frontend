import { IOrganizationGet } from '@/app/(modules)/[organization-slug]/model-interface/interfaces';
import { IUser } from './interfaces';
import { OrganizationModelGet } from '@/app/(modules)/[organization-slug]/model-interface/model';

export class UserModelGet implements IUser {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: string;
  phone_number: string;
  avatar_url: string;
  is_active: boolean;
  is_invited: boolean;
  is_phone_verified: boolean;
  last_login_at: string; // ISO date string
  is_email_varified: boolean;
  organization_id: string;
  joined_at: string;
  created_at: string;
  updated_at: string;
  organization: IOrganizationGet;
  constructor(data?: Partial<IUser>) {
    this.id = data?.id ?? '';
    this.full_name = data?.full_name ?? '';
    this.email = data?.email ?? '';
    this.password = data?.password ?? '';
    this.role = data?.role ?? '';
    this.phone_number = data?.phone_number ?? '';
    this.avatar_url = data?.avatar_url ?? '';
    this.is_active = data?.is_active ?? false;
    this.is_invited = data?.is_invited ?? false;
    this.is_phone_verified = data?.is_phone_verified ?? false;
    this.is_email_varified = data?.is_email_varified ?? false;
    this.organization_id = data?.organization_id ?? '';
    this.joined_at = data?.joined_at ?? ''; // ISO date string
    this.created_at = data?.created_at ?? ''; // ISO date string
    this.updated_at = data?.updated_at ?? ''; // ISO date string
    this.last_login_at = data?.last_login_at ?? ''; // ISO date string
    this.organization = data?.organization || new OrganizationModelGet();
  }
}
