-- CREATE TABLE Events (
--     event_id SERIAL PRIMARY KEY,
--     event_name TEXT NOT NULL,
--     event_date DATE NOT NULL,
--     tier TEXT NOT NULL,
--     UNIQUE (event_name, event_date, tier) -- prevent duplicate events
-- );

-- CREATE TABLE Organizations (
--     org_id SERIAL PRIMARY KEY,
--     org_name TEXT NOT NULL UNIQUE -- ensure org name is unique
--     -- Add additional organization fields if needed
-- );

-- CREATE TABLE Players (
--     player_id SERIAL PRIMARY KEY,
--     player_name TEXT NOT NULL,
--     age INT,
--     org_id INT REFERENCES Organizations(org_id),
--     UNIQUE (player_name, org_id) -- prevent duplicate players in same org
-- );

-- CREATE TABLE EventOrgs (
--     event_org_id SERIAL PRIMARY KEY,
--     event_id INT NOT NULL REFERENCES Events(event_id) ON DELETE CASCADE,
--     org_id INT NOT NULL REFERENCES Organizations(org_id) ON DELETE CASCADE,
--     placement INT,
--     UNIQUE (event_id, org_id) -- prevent same org appearing twice in one event
-- );

-- CREATE TABLE EventOrgPlayers (
--     event_org_id INT NOT NULL REFERENCES EventOrgs(event_org_id) ON DELETE CASCADE,
--     player_id INT NOT NULL REFERENCES Players(player_id) ON DELETE CASCADE,
--     PRIMARY KEY (event_org_id, player_id) -- composite key ensures uniqueness
-- );

DROP TABLE IF EXISTS Events CASCADE;
DROP TABLE IF EXISTS Organizations CASCADE;
DROP TABLE IF EXISTS Players CASCADE;
DROP TABLE IF EXISTS EventOrgs CASCADE;
DROP TABLE IF EXISTS EventOrgPlayers CASCADE;

-- Events Table
CREATE TABLE IF NOT EXISTS Events (
    event_id SERIAL PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    participants INT NOT NULL,
    prize_pool INT,
    event_link TEXT, -- optional link to event's website or social media
    UNIQUE (event_name, participants) -- prevent duplicate events
);

-- Organizations Table
CREATE TABLE IF NOT EXISTS Organizations (
    org_id SERIAL PRIMARY KEY,
    org_name TEXT NOT NULL, -- ensure org name exists
    org_region TEXT NOT NULL, -- region the org is based in
    org_link TEXT NOT NULL, -- optional link to org's liquipedia page
    UNIQUE (org_link, org_region) -- ensure org name is unique within a region
    -- Add additional organization fields if needed
);

-- Players Table (no org_id anymore)
CREATE TABLE IF NOT EXISTS Players (
    player_id SERIAL PRIMARY KEY,
    player_name TEXT NOT NULL,
    player_link TEXT NOT NULL UNIQUE -- optional link to player's profile or social media
    -- is_coach BOOLEAN DEFAULT FALSE, -- indicates if the player is a coach
    -- is_substitute BOOLEAN DEFAULT FALSE, -- indicates if the player is a substitute
);

-- EventOrgs: ties an org to an event and their placement
CREATE TABLE IF NOT EXISTS EventOrgs (
    event_org_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES Events(event_id) ON DELETE CASCADE,
    org_id INT NOT NULL REFERENCES Organizations(org_id) ON DELETE CASCADE,
    placement_start INT,
    placement_end INT,
    winnings INT,
    vct_points INT,
    UNIQUE (event_id, org_id) -- prevent same org appearing twice in one event
);

-- EventOrgPlayers: ties a player to an org at a specific event
CREATE TABLE IF NOT EXISTS EventOrgPlayers (
    event_org_id INT NOT NULL REFERENCES EventOrgs(event_org_id) ON DELETE CASCADE,
    player_id INT NOT NULL REFERENCES Players(player_id) ON DELETE CASCADE,
    PRIMARY KEY (event_org_id, player_id) -- composite key ensures uniqueness
);

-- Enable RLS on Events table
ALTER TABLE Events ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Organizations table
ALTER TABLE Organizations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Players table
ALTER TABLE Players ENABLE ROW LEVEL SECURITY;

-- Enable RLS on EventOrgs table
ALTER TABLE EventOrgs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on EventOrgPlayers table
ALTER TABLE EventOrgPlayers ENABLE ROW LEVEL SECURITY;


-- Public read for Events
CREATE POLICY "Public read access on Events"
ON Events
FOR SELECT
USING (true);

-- Public read for Organizations
CREATE POLICY "Public read access on Organizations"
ON Organizations
FOR SELECT
USING (true);

-- Public read for Players
CREATE POLICY "Public read access on Players"
ON Players
FOR SELECT
USING (true);

-- Public read for EventOrgs
CREATE POLICY "Public read access on EventOrgs"
ON EventOrgs
FOR SELECT
USING (true);

-- Public read for EventOrgPlayers
CREATE POLICY "Public read access on EventOrgPlayers"
ON EventOrgPlayers
FOR SELECT
USING (true);
