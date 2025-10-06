export interface Team {
  id: string;
  name: string;
  region: string;
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
}

export const REGIONS: Region[] = [
  { id: 'am', name: 'Americas'},
  { id: 'emea', name: 'EMEA'},
  { id: 'apac', name: 'Pacific'},
  { id: 'cn', name: 'China'},
];
// Team[] = url
export async function fetchTeams(): Promise<Team[]> {
  const res = await fetch(
    "https://vnmjhgvdrnjmiyzilcla.supabase.co/rest/v1/organizations?select=org_id,org_name,org_region&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpoZ3Zkcm5qbWl5emlsY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDEwNTgsImV4cCI6MjA2OTQ3NzA1OH0.Kxzakd1IrlpskVaQdqdTx4medx2TGIC8-QdQr6CRweA"
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch teams: ${res.status}`);
  }

  const rows: { org_id: string; org_name: string; org_region: string }[] = await res.json();

  return rows.map(r => ({
    id: r.org_id,
    name: r.org_name,
    region: r.org_region,
  }));
}

export const MOCK_PLAYERS: Player[] = [
  { id: 'tenz', name: 'TenZ', realName: 'Tyson Ngo', team: 'Sentinels', region: 'am', role: 'Duelist' },
  { id: 'zekken', name: 'zekken', realName: 'Zachary Patrone', team: 'Sentinels', region: 'na', role: 'Duelist' },
  { id: 'demon1', name: 'Demon1', realName: 'Max Mazanov', team: 'NRG Esports', region: 'na', role: 'Duelist' },
  { id: 'aspas', name: 'aspas', realName: 'Erick Santos', team: 'LEV', region: 'latam', role: 'Duelist' },
  { id: 'derke', name: 'Derke', realName: 'Nikita Sirmitev', team: 'Fnatic', region: 'emea', role: 'Duelist' },
];