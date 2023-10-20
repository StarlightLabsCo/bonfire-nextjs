import type { NextRequest } from 'next/server';

const BLOCKED_COUNTRIES: string[] = ['KP', 'CU', 'IR', 'SY', 'VE', 'RU', 'BY']; // North Korea, Cuba, Iran, Syria, Venezuela, Russia, Belarus

export function middleware(req: NextRequest) {
  if (!req.geo) return new Response('No geo data', { status: 500 });

  const country = req.geo.country;
  if (!country) return new Response('No country', { status: 500 });

  if (BLOCKED_COUNTRIES.includes(country)) {
    console.log(`Blocked request from ${country}.`);
    return new Response('Blocked for legal reasons', { status: 451 });
  }
}
