import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_COUNTRIES: string[] = [
  'AE', // United Arab Emirates - AED
  'AF', // Afghanistan - AFN*
  'AL', // Albania - ALL
  'AM', // Armenia - AMD
  'AO', // Angola - AOA*
  'AR', // Argentina - ARS*
  'AU', // Australia - AUD
  'AW', // Aruba - AWG
  'AZ', // Azerbaijan - AZN
  'BA', // Bosnia and Herzegovina - BAM
  'BB', // Barbados - BBD
  'BD', // Bangladesh - BDT
  'BE', // Belgium - EUR
  'BF', // Burkina Faso - XOF*
  'BG', // Bulgaria - BGN
  'BH', // Bahrain - BHD
  'BI', // Burundi - BIF
  'BM', // Bermuda - BMD
  'BN', // Brunei - BND
  'BO', // Bolivia - BOB*
  'BR', // Brazil - BRL*
  'BS', // Bahamas - BSD
  'BW', // Botswana - BWP
  'BY', // Belarus - BYN
  'BZ', // Belize - BZD
  'CA', // Canada - CAD
  'CD', // DR Congo - CDF
  'CH', // Switzerland - CHF
  'CL', // Chile - CLP*
  'CN', // China - CNY
  'CO', // Colombia - COP*
  'CR', // Costa Rica - CRC*
  'CV', // Cape Verde - CVE*
  'CY', // Cyprus - EUR
  'CZ', // Czech Republic - CZK
  'DE', // Germany - EUR
  'DJ', // Djibouti - DJF*
  'DK', // Denmark - DKK
  'DO', // Dominican Republic - DOP
  'DZ', // Algeria - DZD
  'EC', // Ecuador - USD
  'EE', // Estonia - EUR
  'EG', // Egypt - EGP
  'ER', // Eritrea - ERN
  'ES', // Spain - EUR
  'ET', // Ethiopia - ETB
  'FI', // Finland - EUR
  'FJ', // Fiji - FJD
  'FK', // Falkland Islands - FKP*
  'FR', // France - EUR
  'GA', // Gabon - XAF
  'GB', // United Kingdom - GBP
  'GD', // Grenada - XCD
  'GE', // Georgia - GEL
  'GF', // French Guiana - EUR
  'GH', // Ghana - GHS
  'GI', // Gibraltar - GIP
  'GL', // Greenland - DKK
  'GM', // Gambia - GMD
  'GN', // Guinea - GNF*
  'GQ', // Equatorial Guinea - XAF
  'GR', // Greece - EUR
  'GT', // Guatemala - GTQ*
  'GW', // Guinea-Bissau - XOF*
  'GY', // Guyana - GYD
  'HK', // Hong Kong - HKD
  'HN', // Honduras - HNL*
  'HR', // Croatia - HRK
  'HT', // Haiti - HTG
  'HU', // Hungary - HUF
  'ID', // Indonesia - IDR
  'IE', // Ireland - EUR
  'IL', // Israel - ILS
  'IN', // India - INR
  'IQ', // Iraq - IQD
  'IR', // Iran - IRR
  'IS', // Iceland - ISK
  'IT', // Italy - EUR
  'JM', // Jamaica - JMD
  'JO', // Jordan - JOD
  'JP', // Japan - JPY
  'KE', // Kenya - KES
  'KG', // Kyrgyzstan - KGS
  'KH', // Cambodia - KHR
  'KI', // Kiribati - AUD
  'KM', // Comoros - KMF
  'KN', // Saint Kitts and Nevis - XCD
  'KP', // North Korea - KPW
  'KR', // South Korea - KRW
  'KW', // Kuwait - KWD
  'KY', // Cayman Islands - KYD
  'KZ', // Kazakhstan - KZT
  'LA', // Laos - LAK*
  'LB', // Lebanon - LBP
  'LC', // Saint Lucia - XCD
  'LI', // Liechtenstein - CHF
  'LK', // Sri Lanka - LKR
  'LR', // Liberia - LRD
  'LS', // Lesotho - LSL
  'LT', // Lithuania - EUR
  'LU', // Luxembourg - EUR
  'LV', // Latvia - EUR
  'LY', // Libya - LYD
  'MA', // Morocco - MAD
  'MC', // Monaco - EUR
  'MD', // Moldova - MDL
  'ME', // Montenegro - EUR
  'MG', // Madagascar - MGA
  'MH', // Marshall Islands - USD
  'MK', // North Macedonia - MKD
  'ML', // Mali - XOF*
  'MM', // Myanmar (Burma) - MMK
  'MN', // Mongolia - MNT
  'MO', // Macau - MOP
  'MP', // Northern Mariana Islands - USD
  'MQ', // Martinique - EUR
  'MR', // Mauritania - MRU
  'MS', // Montserrat - XCD
  'MT', // Malta - EUR
  'MU', // Mauritius - MUR*
  'MV', // Maldives - MVR
  'MW', // Malawi - MWK
  'MX', // Mexico - MXN
  'MY', // Malaysia - MYR
  'MZ', // Mozambique - MZN
  'NA', // Namibia - NAD
  'NC', // New Caledonia - XPF*
  'NE', // Niger - XOF*
  'NF', // Norfolk Island - AUD
  'NG', // Nigeria - NGN
  'NI', // Nicaragua - NIO*
  'NL', // Netherlands - EUR
  'NO', // Norway - NOK
  'NP', // Nepal - NPR
  'NR', // Nauru - AUD
  'NU', // Niue - NZD
  'NZ', // New Zealand - NZD
  'OM', // Oman - OMR
  'PA', // Panama - PAB*
  'PE', // Peru - PEN*
  'PF', // French Polynesia - XPF*
  'PG', // Papua New Guinea - PGK
  'PH', // Philippines - PHP
  'PK', // Pakistan - PKR
  'PL', // Poland - PLN
  'PM', // Saint Pierre and Miquelon - EUR
  'PN', // Pitcairn Islands - NZD
  'PR', // Puerto Rico - USD
  'PS', // Palestine - ILS
  'PT', // Portugal - EUR
  'PW', // Palau - USD
  'PY', // Paraguay - PYG*
  'QA', // Qatar - QAR
  'RE', // Réunion - EUR
  'RO', // Romania - RON
  'RS', // Serbia - RSD
  'RU', // Russia - RUB
  'RW', // Rwanda - RWF
  'SA', // Saudi Arabia - SAR
  'SB', // Solomon Islands - SBD
  'SC', // Seychelles - SCR
  'SD', // Sudan - SDG
  'SE', // Sweden - SEK
  'SG', // Singapore - SGD
  'SH', // Saint Helena - SHP*
  'SI', // Slovenia - EUR
  'SJ', // Svalbard and Jan Mayen - NOK
  'SK', // Slovakia - EUR
  'SL', // Sierra Leone - SLL
  'SM', // San Marino - EUR
  'SN', // Senegal - XOF*
  'SO', // Somalia - SOS
  'SR', // Suriname - SRD*
  'SS', // South Sudan - SSP
  'ST', // Sao Tome and Principe - STN
  'SV', // El Salvador - USD
  'SX', // Sint Maarten - ANG
  'SY', // Syria - SYP
  'SZ', // Eswatini - SZL
  'TC', // Turks and Caicos Islands - USD
  'TD', // Chad - XAF
  'TF', // French Southern Territories - EUR
  'TG', // Togo - XOF*
  'TH', // Thailand - THB
  'TJ', // Tajikistan - TJS
  'TK', // Tokelau - NZD
  'TL', // Timor-Leste - USD
  'TM', // Turkmenistan - TMT
  'TN', // Tunisia - TND
  'TO', // Tonga - TOP
  'TR', // Turkey - TRY
  'TT', // Trinidad and Tobago - TTD
  'TV', // Tuvalu - AUD
  'TW', // Taiwan - TWD
  'TZ', // Tanzania - TZS
  'UA', // Ukraine - UAH
  'UG', // Uganda - UGX
  'UM', // U.S. Minor Outlying Islands - USD
  'US', // United States - USD
  'UY', // Uruguay - UYU*
  'UZ', // Uzbekistan - UZS
  'VA', // Vatican City (Holy See) - EUR
  'VC', // Saint Vincent and the Grenadines - XCD
  'VE', // Venezuela - VES
  'VG', // British Virgin Islands - USD
  'VI', // U.S. Virgin Islands - USD
  'VN', // Vietnam - VND
  'VU', // Vanuatu - VUV
  'WF', // Wallis and Futuna - XPF*
  'WS', // Samoa - WST
  'XK', // Kosovo - EUR
  'YE', // Yemen - YER
  'YT', // Mayotte - EUR
  'ZA', // South Africa - ZAR
  'ZM', // Zambia - ZMW
  'ZW', // Zimbabwe - USD
  // Please note that some currencies are marked with an asterisk (*) as they may not be widely recognized or accepted.
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
