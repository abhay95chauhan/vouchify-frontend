import { IOrganizationGet } from './interfaces';

export class OrganizationModelGet implements IOrganizationGet {
  id: string;
  name: string;
  email: string;
  api_secret: string;
  api_key: string;
  slug: string;
  subcription_status: string;
  subcription: string;
  created_at: string;
  updated_at: string;
  industry: string;
  organization_type: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  description?: string;
  website?: string;
  subcription_cost: number;
  subcription_expire: string;

  constructor(data?: Partial<IOrganizationGet>) {
    this.id = data?.id ?? '';
    this.name = data?.name ?? '';
    this.email = data?.email ?? '';
    this.api_secret = data?.api_secret ?? '';
    this.api_key = data?.api_key ?? '';
    this.slug = data?.slug ?? '';
    this.subcription_status = data?.subcription_status ?? '';
    this.subcription = data?.subcription ?? '';
    this.industry = data?.industry ?? '';
    this.organization_type = data?.organization_type ?? '';
    this.currency = data?.currency ?? ''; // ISO date string
    this.currency_symbol = data?.currency_symbol ?? ''; // ISO date string
    this.created_at = data?.created_at ?? ''; // ISO date string
    this.updated_at = data?.updated_at ?? ''; // ISO date string
    this.timezone = data?.timezone ?? '';
    this.description = data?.description ?? '';
    this.website = data?.website ?? '';
    this.subcription_cost = data?.subcription_cost ?? 0;
    this.subcription_expire = data?.subcription_expire ?? '';
  }
}
