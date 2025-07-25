export interface Team {
  id: string;
  name: string;
  region: string;
  logo?: string;
}

export interface Player {
  id: string;
  name: string;
  realName: string;
  team: string;
  region: string;
  role: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
}

export const REGIONS: Region[] = [
  { id: 'na', name: 'North America', code: 'NA' },
  { id: 'emea', name: 'Europe, Middle East & Africa', code: 'EMEA' },
  { id: 'apac', name: 'Asia-Pacific', code: 'APAC' },
  { id: 'latam', name: 'Latin America', code: 'LATAM' },
  { id: 'br', name: 'Brazil', code: 'BR' },
  { id: 'kr', name: 'South Korea', code: 'KR' },
];

export const MOCK_TEAMS: Team[] = [
  { id: 'sen', name: 'Sentinels', region: 'na' },
  { id: 'nrg', name: 'NRG Esports', region: 'na' },
  { id: 'c9', name: 'Cloud9', region: 'na' },
  { id: 'fnc', name: 'Fnatic', region: 'emea' },
  { id: 'navi', name: 'NAVI', region: 'emea' },
  { id: 'prx', name: 'Paper Rex', region: 'apac' },
  { id: 'drx', name: 'DRX', region: 'kr' },
];

export const MOCK_PLAYERS: Player[] = [
  { id: 'tenz', name: 'TenZ', realName: 'Tyson Ngo', team: 'Sentinels', region: 'na', role: 'Duelist' },
  { id: 'zekken', name: 'zekken', realName: 'Zachary Patrone', team: 'Sentinels', region: 'na', role: 'Duelist' },
  { id: 'demon1', name: 'Demon1', realName: 'Max Mazanov', team: 'NRG Esports', region: 'na', role: 'Duelist' },
  { id: 'aspas', name: 'aspas', realName: 'Erick Santos', team: 'LEV', region: 'latam', role: 'Duelist' },
  { id: 'derke', name: 'Derke', realName: 'Nikita Sirmitev', team: 'Fnatic', region: 'emea', role: 'Duelist' },
];