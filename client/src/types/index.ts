import organizations from '../data/organizations.json';
import players from '../data/players.json';
import events from '../data/events.json';

export interface Team {
  id: number;
  name: string;
  region: string;
  logo?: string;
}

export const TEAMS: Team[] = organizations as Team[];

export interface Player {
  id: number;
  name: string;
  // realName: string;
  // team: string;
  // region: string;
  // role: string;
  link?: string;
}

export const PLAYERS: Player[] = players as Player[];

export interface Region {
  id: string;
  name: string;
}

export const REGIONS: Region[] = [
  { id: 'am', name: 'Americas'},
  { id: 'emea', name: 'EMEA'},
  { id: 'apac', name: 'Pacific'},
  { id: 'cn', name: 'China'},
];

export interface Event {
  id: number;
  event_name: string;
  start_date: string;
  end_date: string;
  participants: number | null;
  prize_pool: number | null;
  event_link?: string;
}

export const EVENTS: Event[] = events as Event[];

// export const MOCK_TEAMS: Team[] = [
//   { id: 'sen', name: 'Sentinels', region: 'na' },
//   { id: 'nrg', name: 'NRG Esports', region: 'na' },
//   { id: 'c9', name: 'Cloud9', region: 'na' },
//   { id: 'fnc', name: 'Fnatic', region: 'emea' },
//   { id: 'navi', name: 'NAVI', region: 'emea' },
//   { id: 'prx', name: 'Paper Rex', region: 'apac' },
//   { id: 'drx', name: 'DRX', region: 'kr' },
// ];

// export const MOCK_PLAYERS: Player[] = [
//   { id: 'tenz', name: 'TenZ', realName: 'Tyson Ngo', team: 'Sentinels', region: 'am', role: 'Duelist' },
//   { id: 'zekken', name: 'zekken', realName: 'Zachary Patrone', team: 'Sentinels', region: 'na', role: 'Duelist' },
//   { id: 'demon1', name: 'Demon1', realName: 'Max Mazanov', team: 'NRG Esports', region: 'na', role: 'Duelist' },
//   { id: 'aspas', name: 'aspas', realName: 'Erick Santos', team: 'LEV', region: 'latam', role: 'Duelist' },
//   { id: 'derke', name: 'Derke', realName: 'Nikita Sirmitev', team: 'Fnatic', region: 'emea', role: 'Duelist' },
// ];