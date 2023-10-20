import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_COUNTRIES: string[] = [
  'AU',
  'AT',
  'BE',
  'BR',
  'BG',
  'CA',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GI',
  'GR',
  'HK',
  'HU',
  'IN',
  'ID',
  'IE',
  'IT',
  'JP',
  'LV',
  'LI',
  'LT',
  'LU',
  'MY',
  'MT',
  'MX',
  'NL',
  'NZ',
  'NO',
  'PL',
  'PT',
  'RO',
  'SG',
  'SK',
  'SI',
  'ES',
  'SE',
  'CH',
  'TH',
  'AE',
  'GB',
  'UM',
  'US',
];

export function middleware(req: NextRequest) {
  // Geoblocking
  if (!req.geo) return new Response('No geo data', { status: 500 });

  const country = req.geo.country;
  if (!country) return new Response('No country', { status: 500 });

  if (!ALLOWED_COUNTRIES.includes(country)) {
    console.log(`Blocked request from ${country}.`);
    return new Response('Blocked for legal reasons', { status: 451 });
  }

  return NextResponse.next();
}
