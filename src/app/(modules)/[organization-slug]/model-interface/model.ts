import {
  ISubscriptionGet,
  ISubscriptionPeriod,
} from '../../subcriptions/model-interfaces/interfaces';
import { SubscriptionModelGet } from '../../subcriptions/model-interfaces/model';
import { IApiKeysGet, IOrganizationGet } from './interfaces';

export class ApiKeyModel implements IApiKeysGet {
  id: string;
  api_key: string;
  api_secret: string;
  organization_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  constructor(partial?: Partial<IApiKeysGet>) {
    // Object.assign(this, partial);
    this.id = partial?.id ?? '';
    this.api_key = partial?.api_key ?? '';
    this.api_secret = partial?.api_secret ?? '';
    this.organization_id = partial?.organization_id ?? '';
    this.user_id = partial?.user_id ?? '';
    this.created_at = partial?.created_at ?? '';
    this.updated_at = partial?.updated_at ?? '';
  }
}

export class OrganizationModelGet implements IOrganizationGet {
  id: string;
  name: string;
  email: string;
  api_key_id: string;
  api_keys: IApiKeysGet;
  slug: string;
  subcription_id: string;
  subscription_period: ISubscriptionPeriod;
  subcription: ISubscriptionGet;
  created_at: string;
  updated_at: string;
  industry: string;
  organization_type: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  description?: string;
  website?: string;
  subcription_status: string;
  subcription_expire: string;

  constructor(data?: Partial<IOrganizationGet>) {
    this.id = data?.id ?? '';
    this.name = data?.name ?? '';
    this.email = data?.email ?? '';
    this.subcription_status = data?.subcription_status ?? '';
    this.api_key_id = data?.api_key_id ?? '';
    this.api_keys = data?.api_keys ?? new ApiKeyModel();
    this.slug = data?.slug ?? '';
    this.subcription_id = data?.subcription_id ?? '';
    this.subscription_period = data?.subscription_period ?? 'monthly';
    this.subcription = data?.subcription ?? new SubscriptionModelGet();
    this.industry = data?.industry ?? '';
    this.organization_type = data?.organization_type ?? '';
    this.currency = data?.currency ?? ''; // ISO date string
    this.currency_symbol = data?.currency_symbol ?? ''; // ISO date string
    this.created_at = data?.created_at ?? ''; // ISO date string
    this.updated_at = data?.updated_at ?? ''; // ISO date string
    this.timezone = data?.timezone ?? '';
    this.description = data?.description ?? '';
    this.website = data?.website ?? '';
    this.subcription_expire = data?.subcription_expire ?? '';
  }
}
