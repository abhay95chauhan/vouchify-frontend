export type ISubscriptionPeriod = 'monthly' | 'yearly';

export interface ISubscriptionGet {
  id: string;
  isFree: boolean;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  discount_in_percentage: number;
  description?: string | null;
  features: string[];
  buttonLabel: string;
  created_at: string;
  updated_at: string;
}
