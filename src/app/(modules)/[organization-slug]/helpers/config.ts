import {
  Building,
  Building2,
  CreditCard,
  Globe,
  Landmark,
  University,
} from 'lucide-react';
import moment from 'moment-timezone';
export const industryTypes = [
  {
    value: 'private',
    label: 'Private',
    description: 'A Private Industry',
    icon: Building,
  },
  {
    value: 'government',
    label: 'Government',
    description: 'A Government Industry',
    icon: Landmark,
  },
  {
    value: 'semi-Government',
    label: 'Semi Government',
    description: 'A Semi Government Industry',
    icon: University,
  },
];

export const industries = [
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Retail', value: 'retail' },
  { label: 'Education', value: 'education' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Transportation & Logistics', value: 'transportation_logistics' },
  { label: 'Construction', value: 'construction' },
  { label: 'Entertainment & Media', value: 'entertainment_media' },
  { label: 'Government', value: 'government' },
  { label: 'Energy & Utilities', value: 'energy_utilities' },
  { label: 'Telecommunications', value: 'telecommunications' },
];

export const currencies = [
  { label: 'US Dollar (USD)', value: 'USD', symbol: '$' },
  { label: 'Euro (EUR)', value: 'EUR', symbol: '€' },
  { label: 'British Pound (GBP)', value: 'GBP', symbol: '£' },
  { label: 'Japanese Yen (JPY)', value: 'JPY', symbol: '¥' },
  { label: 'Swiss Franc (CHF)', value: 'CHF', symbol: 'CHF' },
  { label: 'Canadian Dollar (CAD)', value: 'CAD', symbol: 'CA$' },
  { label: 'Australian Dollar (AUD)', value: 'AUD', symbol: 'A$' },
  { label: 'New Zealand Dollar (NZD)', value: 'NZD', symbol: 'NZ$' },
  { label: 'Chinese Yuan Renminbi (CNY)', value: 'CNY', symbol: '¥' },
  { label: 'Indian Rupee (INR)', value: 'INR', symbol: '₹' },
  { label: 'Russian Ruble (RUB)', value: 'RUB', symbol: '₽' },
  { label: 'Brazilian Real (BRL)', value: 'BRL', symbol: 'R$' },
  { label: 'Mexican Peso (MXN)', value: 'MXN', symbol: 'MX$' },
  { label: 'South African Rand (ZAR)', value: 'ZAR', symbol: 'R' },
  { label: 'Singapore Dollar (SGD)', value: 'SGD', symbol: 'S$' },
  { label: 'Hong Kong Dollar (HKD)', value: 'HKD', symbol: 'HK$' },
  { label: 'Norwegian Krone (NOK)', value: 'NOK', symbol: 'kr' },
  { label: 'Swedish Krona (SEK)', value: 'SEK', symbol: 'kr' },
  { label: 'Danish Krone (DKK)', value: 'DKK', symbol: 'kr' },
  { label: 'Polish Zloty (PLN)', value: 'PLN', symbol: 'zł' },
  { label: 'Turkish Lira (TRY)', value: 'TRY', symbol: '₺' },
  { label: 'Thai Baht (THB)', value: 'THB', symbol: '฿' },
  { label: 'Malaysian Ringgit (MYR)', value: 'MYR', symbol: 'RM' },
  { label: 'Philippine Peso (PHP)', value: 'PHP', symbol: '₱' },
  { label: 'Indonesian Rupiah (IDR)', value: 'IDR', symbol: 'Rp' },
  { label: 'Vietnamese Dong (VND)', value: 'VND', symbol: '₫' },
  { label: 'United Arab Emirates Dirham (AED)', value: 'AED', symbol: 'د.إ' },
  { label: 'Saudi Riyal (SAR)', value: 'SAR', symbol: '﷼' },
  { label: 'Qatari Riyal (QAR)', value: 'QAR', symbol: '﷼' },
  { label: 'Kuwaiti Dinar (KWD)', value: 'KWD', symbol: 'د.ك' },
  { label: 'Bahraini Dinar (BHD)', value: 'BHD', symbol: 'ب.د' },
  { label: 'Omani Rial (OMR)', value: 'OMR', symbol: '﷼' },
  { label: 'Egyptian Pound (EGP)', value: 'EGP', symbol: '£' },
  { label: 'Nigerian Naira (NGN)', value: 'NGN', symbol: '₦' },
  { label: 'Kenyan Shilling (KES)', value: 'KES', symbol: 'Sh' },
  { label: 'Ghanaian Cedi (GHS)', value: 'GHS', symbol: '₵' },
  { label: 'Bangladeshi Taka (BDT)', value: 'BDT', symbol: '৳' },
  { label: 'Pakistani Rupee (PKR)', value: 'PKR', symbol: '₨' },
  { label: 'Sri Lankan Rupee (LKR)', value: 'LKR', symbol: 'Rs' },
  { label: 'Nepalese Rupee (NPR)', value: 'NPR', symbol: 'Rs' },
  { label: 'Icelandic Krona (ISK)', value: 'ISK', symbol: 'kr' },
  { label: 'Czech Koruna (CZK)', value: 'CZK', symbol: 'Kč' },
  { label: 'Hungarian Forint (HUF)', value: 'HUF', symbol: 'Ft' },
  { label: 'Romanian Leu (RON)', value: 'RON', symbol: 'lei' },
  { label: 'Israeli New Shekel (ILS)', value: 'ILS', symbol: '₪' },
  { label: 'Chilean Peso (CLP)', value: 'CLP', symbol: 'CLP$' },
  { label: 'Colombian Peso (COP)', value: 'COP', symbol: 'COL$' },
  { label: 'Argentine Peso (ARS)', value: 'ARS', symbol: 'AR$' },
  { label: 'Peruvian Sol (PEN)', value: 'PEN', symbol: 'S/' },
  { label: 'Venezuelan Bolívar (VES)', value: 'VES', symbol: 'Bs.' },
];

export const timezonesWithOffset = moment.tz.names().map((tz) => {
  const offset = moment.tz(tz).format('Z'); // e.g., "+05:30"
  return { label: `${tz} (UTC${offset})`, value: tz };
});

export const formSteps = [
  {
    id: 1,
    title: 'Organization Details',
    description: 'Basic information about your organization',
    icon: Building2,
  },
  {
    id: 2,
    title: 'Configuration',
    description: 'Set up your preferences and settings',
    icon: Globe,
  },
  {
    id: 3,
    title: 'Choose Plan',
    description: 'Select the perfect plan for your needs',
    icon: CreditCard,
  },
];
