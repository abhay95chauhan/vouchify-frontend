/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IApiKeysGet {
  id: string;
  api_key: string;
  api_secret: string;
  organization_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface IOrganizationPost {
  name: string;
  industry: string;
  organization_type: string;
  email?: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  description?: string;
  website?: string;
  subcription_cost?: number;
  subcription_expire: Date;
}

export interface IOrganizationGet {
  id: string;
  name: string;
  email?: string;
  api_key_id: string;
  api_keys: IApiKeysGet;
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
}

// generic res

export interface IGenericRes<T> {
  code: number;
  data: T;
  message: string;
  status: string;
  error?: Record<string, any>;
}
