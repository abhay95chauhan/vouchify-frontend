import { ISubscriptionGet } from './interfaces';

export class SubscriptionModelGet implements ISubscriptionGet {
  id: string;
  isFree: boolean;
  name: string;
  price: { monthly: number; yearly: number };
  description?: string | null;
  features: string[];
  buttonLabel: string;
  created_at: string;
  updated_at: string;

  constructor(data?: ISubscriptionGet) {
    this.id = data?.id ?? '';
    this.isFree = data?.isFree || false;
    this.name = data?.name ?? '';
    this.price = data?.price ?? {
      monthly: 0,
      yearly: 0,
    };
    this.description = data?.description ?? '';
    this.features = data?.features ?? [];
    this.buttonLabel = data?.buttonLabel ?? '';
    this.created_at = data?.created_at ?? '';
    this.updated_at = data?.updated_at ?? '';
  }

  // Example helper method
  getFormattedPrice(frequency: 'monthly' | 'yearly'): string {
    return this.isFree
      ? 'Free'
      : `$${this.price[frequency]}/${frequency === 'monthly' ? 'mo' : 'yr'}`;
  }
}
