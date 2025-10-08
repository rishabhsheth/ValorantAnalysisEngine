// scripts/fetchData.ts
import 'dotenv/config';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Recreate __dirname / __filename for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


const REGION_MAP: Record<string, 'am' | 'emea' | 'apac' | 'cn' | 'other'> = {
  na: 'am', latam: 'am', sa: 'am', americas: 'am', 'north america': 'am', 'south america': 'am',
  emea: 'emea', eu: 'emea', mea: 'emea', 'europe': 'emea', 'middle east': 'emea', 'africa': 'emea',
  apac: 'apac', pacific: 'apac', oce: 'apac', kr: 'apac', korea: 'apac', jp: 'apac', japan: 'apac',
  cn: 'cn', china: 'cn', other: 'other',
};


async function fetchData() {
  console.log("Fetching data from Supabase...");

  // --- Organizations ---
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .order('org_name', { ascending: true });
  if (orgError) throw orgError;

  const mappedOrgs = orgData.map(r => {
    const region = REGION_MAP[(r.org_region ?? '').toLowerCase().trim()] ?? '';
    return {
      id: r.org_id,
      name: r.org_name,
      region,
      logo: undefined, // optional
    };
  });

  const orgPath = path.join(__dirname, "../src/data/organizations.json");
  fs.mkdirSync(path.dirname(orgPath), { recursive: true });
  fs.writeFileSync(orgPath, JSON.stringify(mappedOrgs, null, 2));
  console.log(`✅ Saved organizations.json (${mappedOrgs.length} items)`);

  // --- Players ---
  const { data: playerData, error: playerError } = await supabase
    .from("players")
    .select("*")
    .order('player_name', { ascending: true });
  if (playerError) throw playerError;

  const mappedPlayers = playerData.map(p => ({
    id: p.player_id,
    name: p.player_name,
    link: p.player_link ?? undefined,
  }));

  const playerPath = path.join(__dirname, "../src/data/players.json");
  fs.writeFileSync(playerPath, JSON.stringify(mappedPlayers, null, 2));
  console.log(`✅ Saved players.json (${mappedPlayers.length} items)`);
}

fetchData().catch((err) => {
  console.error("❌ Error fetching data:", err);
  process.exit(1);
});
