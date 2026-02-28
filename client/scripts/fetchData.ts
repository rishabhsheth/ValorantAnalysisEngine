import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

type RegionId = "am" | "emea" | "apac" | "cn" | "other" | "";

type OrganizationRecord = {
  id: number;
  name: string;
  region: RegionId;
  logo?: string;
};

type EventRecord = {
  id: number;
  event_name: string;
  start_date: string;
  end_date: string;
  participants: number | null;
  prize_pool: number | null;
  event_link?: string;
};

type EventOrgRecord = {
  event_id: number;
  org_id: number;
  placement_start: number | null;
  placement_end: number | null;
  winnings: number;
  vct_points: number;
};

type Participation = {
  org_id: number;
  team_name: string;
  region: RegionId;
  event_id: number;
  event_name: string;
  event_date: string;
  participants: number;
  placement_start: number;
  placement_end: number;
  placement_mid: number;
  normalized_score: number;
  winnings: number;
  vct_points: number;
  prize_pool: number;
};

type TeamPerformanceRecord = {
  rank: number;
  team_id: number;
  team_name: string;
  region: RegionId;
  events_attended: number;
  championships: number;
  podium_finishes: number;
  avg_placement: number;
  best_placement: number;
  avg_participants: number;
  total_winnings: number;
  total_vct_points: number;
  efficiency_score: number;
  pressure_score: number;
  discipline_score: number;
  adaptability_score: number;
  consistency_score: number;
  momentum_index: number;
  expected_vs_actual: number;
  fragility_score: number;
  identity_score: number;
  composite_score: number;
  archetype: string;
  archetype_reason: string;
  last_event_date: string | null;
};

type TeamIntermediate = {
  team_id: number;
  team_name: string;
  region: RegionId;
  events_attended: number;
  championships: number;
  podium_finishes: number;
  avg_placement: number;
  best_placement: number;
  avg_participants: number;
  total_winnings: number;
  total_vct_points: number;
  last_event_date: string | null;
  context_score: number;
  avg_winnings_share: number;
  avg_vct_points: number;
  pressure_raw: number;
  discipline_raw: number;
  adaptability_raw: number;
  consistency_raw: number;
  momentum_index: number;
  overperform_raw: number;
  fragility_raw: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? ""
);

const REGION_MAP: Record<string, RegionId> = {
  na: "am",
  latam: "am",
  sa: "am",
  americas: "am",
  "north america": "am",
  "south america": "am",
  emea: "emea",
  eu: "emea",
  mea: "emea",
  europe: "emea",
  "middle east": "emea",
  africa: "emea",
  apac: "apac",
  pacific: "apac",
  oce: "apac",
  kr: "apac",
  korea: "apac",
  jp: "apac",
  japan: "apac",
  cn: "cn",
  china: "cn",
  other: "other",
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const round = (value: number, decimals = 2): number => {
  const power = 10 ** decimals;
  return Math.round(value * power) / power;
};

const safeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const safePositiveInt = (value: unknown, fallback = 0): number => {
  const n = Math.round(safeNumber(value, fallback));
  return n >= 0 ? n : fallback;
};

const average = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const stdDev = (values: number[]): number => {
  if (values.length <= 1) return 0;
  const mean = average(values);
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

const quantile = (values: number[], q: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * clamp(q, 0, 1);
  const base = Math.floor(pos);
  const fraction = pos - base;
  const lower = sorted[base];
  const upper = sorted[Math.min(base + 1, sorted.length - 1)];
  return lower + fraction * (upper - lower);
};

const linearSlope = (values: number[]): number => {
  if (values.length <= 1) return 0;
  const xMean = (values.length - 1) / 2;
  const yMean = average(values);
  let numerator = 0;
  let denominator = 0;
  values.forEach((y, index) => {
    const x = index;
    numerator += (x - xMean) * (y - yMean);
    denominator += (x - xMean) ** 2;
  });
  if (denominator === 0) return 0;
  return numerator / denominator;
};

const minMaxScale = (values: number[]): number[] => {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map((value) => (value - min) / (max - min));
};

const normalizePlacement = (placement: number, participants: number): number => {
  if (participants <= 1) return 1;
  const boundedPlacement = clamp(placement, 1, participants);
  return (participants - boundedPlacement) / (participants - 1);
};

const toMapArray = <T>(items: T[], keyFn: (item: T) => number): Map<number, T[]> => {
  const map = new Map<number, T[]>();
  items.forEach((item) => {
    const key = keyFn(item);
    const existing = map.get(key);
    if (existing) {
      existing.push(item);
    } else {
      map.set(key, [item]);
    }
  });
  return map;
};

const buildTeamPerformance = (
  organizations: OrganizationRecord[],
  events: EventRecord[],
  eventOrgs: EventOrgRecord[]
): TeamPerformanceRecord[] => {
  const orgById = new Map<number, OrganizationRecord>(
    organizations.map((org) => [org.id, org])
  );
  const eventById = new Map<number, EventRecord>(events.map((event) => [event.id, event]));

  const eventEntryCounts = new Map<number, number>();
  eventOrgs.forEach((row) => {
    eventEntryCounts.set(row.event_id, (eventEntryCounts.get(row.event_id) ?? 0) + 1);
  });

  const participations: Participation[] = [];
  eventOrgs.forEach((row) => {
    const org = orgById.get(row.org_id);
    const event = eventById.get(row.event_id);
    if (!org || !event) return;

    const fallbackParticipants = eventEntryCounts.get(event.id) ?? 0;
    const participants = Math.max(
      1,
      safePositiveInt(event.participants, fallbackParticipants)
    );
    const rawStart = safePositiveInt(row.placement_start, participants);
    const rawEnd = safePositiveInt(
      row.placement_end ?? row.placement_start,
      rawStart || participants
    );
    const placementStart = clamp(rawStart || participants, 1, participants);
    const placementEnd = clamp(Math.max(rawEnd || placementStart, placementStart), 1, participants);
    const placementMid = (placementStart + placementEnd) / 2;
    const normalizedScore = normalizePlacement(placementMid, participants);

    participations.push({
      org_id: org.id,
      team_name: org.name,
      region: org.region,
      event_id: event.id,
      event_name: event.event_name,
      event_date: event.start_date,
      participants,
      placement_start: placementStart,
      placement_end: placementEnd,
      placement_mid: placementMid,
      normalized_score: normalizedScore,
      winnings: Math.max(0, safeNumber(row.winnings, 0)),
      vct_points: Math.max(0, safeNumber(row.vct_points, 0)),
      prize_pool: Math.max(0, safeNumber(event.prize_pool, 0)),
    });
  });

  if (participations.length === 0) return [];

  const participationByTeam = toMapArray(participations, (row) => row.org_id);
  const participationByEvent = toMapArray(participations, (row) => row.event_id);

  const baseScoreByTeam = new Map<number, number>();
  participationByTeam.forEach((rows, orgId) => {
    baseScoreByTeam.set(orgId, average(rows.map((row) => row.normalized_score)));
  });

  const eventStrengthById = new Map<number, number>();
  participationByEvent.forEach((rows, eventId) => {
    const fieldStrength = average(
      rows.map((row) => baseScoreByTeam.get(row.org_id) ?? row.normalized_score)
    );
    eventStrengthById.set(eventId, fieldStrength);
  });

  const expectedRankByEventTeam = new Map<string, number>();
  participationByEvent.forEach((rows, eventId) => {
    const sortedByBase = [...rows].sort(
      (a, b) => (baseScoreByTeam.get(b.org_id) ?? 0) - (baseScoreByTeam.get(a.org_id) ?? 0)
    );
    sortedByBase.forEach((row, index) => {
      expectedRankByEventTeam.set(`${eventId}:${row.org_id}`, index + 1);
    });
  });

  const participantValues = participations.map((row) => row.participants);
  const smallEventCutoff = quantile(participantValues, 0.33);
  const mediumEventCutoff = quantile(participantValues, 0.66);
  const totalYears = new Set(
    participations
      .map((row) => row.event_date.slice(0, 4))
      .filter((year) => year.length === 4)
  );

  const teamIntermediates: TeamIntermediate[] = [];
  const maxEventsAttended = Math.max(
    1,
    ...Array.from(participationByTeam.values()).map((teamRows) => teamRows.length)
  );

  participationByTeam.forEach((rows, orgId) => {
    const sortedRows = [...rows].sort((a, b) => {
      const dateDiff =
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.event_id - b.event_id;
    });

    const normalizedSeries = sortedRows.map((row) => row.normalized_score);
    const avgPlacement = average(sortedRows.map((row) => row.placement_mid));
    const bestPlacement = Math.min(
      ...sortedRows.map((row) => Math.min(row.placement_start, row.placement_end))
    );

    const podiumFinishes = sortedRows.filter(
      (row) => Math.min(row.placement_start, row.placement_end) <= 3
    ).length;
    const championships = sortedRows.filter(
      (row) => Math.min(row.placement_start, row.placement_end) === 1
    ).length;

    const deepRuns = sortedRows.filter((row) => {
      const threshold = Math.max(4, Math.ceil(row.participants * 0.35));
      return Math.min(row.placement_start, row.placement_end) <= threshold;
    }).length;

    const closeoutRate = deepRuns > 0 ? podiumFinishes / deepRuns : 0;
    const championshipConversion = podiumFinishes > 0 ? championships / podiumFinishes : 0;
    const pressureRaw = clamp(0.65 * closeoutRate + 0.35 * championshipConversion, 0, 1);

    const volatility = stdDev(normalizedSeries);
    const eventsAttended = sortedRows.length;
    const appearanceLogMultiplier =
      1 +
      0.8 * (Math.log1p(eventsAttended) / Math.log1p(maxEventsAttended));
    const adjustedVolatility = volatility / appearanceLogMultiplier;
    let collapses = 0;
    let strongSetups = 0;
    for (let index = 1; index < normalizedSeries.length; index += 1) {
      const previous = normalizedSeries[index - 1];
      const current = normalizedSeries[index];
      if (previous >= 0.7) {
        strongSetups += 1;
        if (current <= 0.4) collapses += 1;
      }
    }
    const collapseRate = strongSetups > 0 ? collapses / strongSetups : 0;
    const disciplineRaw = clamp(1 - volatility * 1.1 - collapseRate * 0.7, 0, 1);
    const fragilityRaw = clamp(collapseRate + Math.max(0, volatility - 0.2), 0, 1);
    const consistencyRaw = clamp(1 - adjustedVolatility * 1.4, 0, 1);

    const contextScore = clamp(
      average(
        sortedRows.map((row) => {
          const fieldStrength = eventStrengthById.get(row.event_id) ?? 0.5;
          return row.normalized_score * (0.65 + 0.7 * fieldStrength);
        })
      ),
      0,
      1
    );

    const avgWinningsShare = average(
      sortedRows.map((row) =>
        row.prize_pool > 0 ? clamp(row.winnings / row.prize_pool, 0, 1) : 0
      )
    );
    const avgVctPoints = average(sortedRows.map((row) => row.vct_points));

    const bucketMap = new Map<string, number[]>();
    const yearMap = new Map<string, number[]>();
    sortedRows.forEach((row) => {
      const sizeBucket =
        row.participants <= smallEventCutoff
          ? "small"
          : row.participants <= mediumEventCutoff
            ? "medium"
            : "large";
      const bucketScores = bucketMap.get(sizeBucket) ?? [];
      bucketScores.push(row.normalized_score);
      bucketMap.set(sizeBucket, bucketScores);

      const year = row.event_date.slice(0, 4);
      const yearScores = yearMap.get(year) ?? [];
      yearScores.push(row.normalized_score);
      yearMap.set(year, yearScores);
    });
    const contextMeans = [
      ...Array.from(bucketMap.values()).map((scores) => average(scores)),
      ...Array.from(yearMap.values()).map((scores) => average(scores)),
    ];
    const contextSpread = contextMeans.length > 1 ? stdDev(contextMeans) : 0;
    const yearCoverage = totalYears.size > 0 ? yearMap.size / totalYears.size : 0;
    const adaptabilityRaw = clamp(
      0.7 * (1 - contextSpread * 1.3) + 0.3 * yearCoverage,
      0,
      1
    );

    const slope = linearSlope(normalizedSeries);
    const momentumIndex = round(clamp(Math.tanh(slope * 8) * 100, -100, 100), 2);

    const overperformRaw = average(
      sortedRows.map((row) => {
        const expectedRank =
          expectedRankByEventTeam.get(`${row.event_id}:${row.org_id}`) ??
          (row.participants + 1) / 2;
        return (expectedRank - row.placement_mid) / row.participants;
      })
    );

    teamIntermediates.push({
      team_id: orgId,
      team_name: sortedRows[0]?.team_name ?? `Team ${orgId}`,
      region: sortedRows[0]?.region ?? "",
      events_attended: sortedRows.length,
      championships,
      podium_finishes: podiumFinishes,
      avg_placement: avgPlacement,
      best_placement: bestPlacement,
      avg_participants: average(sortedRows.map((row) => row.participants)),
      total_winnings: sortedRows.reduce((sum, row) => sum + row.winnings, 0),
      total_vct_points: sortedRows.reduce((sum, row) => sum + row.vct_points, 0),
      last_event_date: sortedRows[sortedRows.length - 1]?.event_date ?? null,
      context_score: contextScore,
      avg_winnings_share: avgWinningsShare,
      avg_vct_points: avgVctPoints,
      pressure_raw: pressureRaw,
      discipline_raw: disciplineRaw,
      adaptability_raw: adaptabilityRaw,
      consistency_raw: consistencyRaw,
      momentum_index: momentumIndex,
      overperform_raw: overperformRaw,
      fragility_raw: fragilityRaw,
    });
  });

  if (teamIntermediates.length === 0) return [];

  const vctScaled = minMaxScale(teamIntermediates.map((team) => team.avg_vct_points));
  const overperformScaled = minMaxScale(
    teamIntermediates.map((team) => team.overperform_raw)
  );

  const initialRecords = teamIntermediates.map((team, index) => {
    const efficiencyScore = clamp(
      (0.68 * team.context_score +
        0.2 * team.avg_winnings_share +
        0.12 * vctScaled[index]) *
        100,
      0,
      100
    );
    const pressureScore = clamp(team.pressure_raw * 100, 0, 100);
    const disciplineScore = clamp(team.discipline_raw * 100, 0, 100);
    const adaptabilityScore = clamp(team.adaptability_raw * 100, 0, 100);
    const consistencyScore = clamp(team.consistency_raw * 100, 0, 100);
    const fragilityScore = clamp(team.fragility_raw * 100, 0, 100);
    const momentumNormalized = (team.momentum_index + 100) / 200;
    const compositeScore = clamp(
      (0.26 * (efficiencyScore / 100) +
        0.16 * (pressureScore / 100) +
        0.14 * (disciplineScore / 100) +
        0.14 * (adaptabilityScore / 100) +
        0.16 * (consistencyScore / 100) +
        0.08 * momentumNormalized +
        0.06 * overperformScaled[index]) *
        100,
      0,
      100
    );

    return {
      team_id: team.team_id,
      team_name: team.team_name,
      region: team.region,
      events_attended: team.events_attended,
      championships: team.championships,
      podium_finishes: team.podium_finishes,
      avg_placement: round(team.avg_placement),
      best_placement: round(team.best_placement),
      avg_participants: round(team.avg_participants),
      total_winnings: round(team.total_winnings, 0),
      total_vct_points: round(team.total_vct_points, 0),
      efficiency_score: round(efficiencyScore),
      pressure_score: round(pressureScore),
      discipline_score: round(disciplineScore),
      adaptability_score: round(adaptabilityScore),
      consistency_score: round(consistencyScore),
      momentum_index: round(team.momentum_index),
      expected_vs_actual: round(team.overperform_raw * 100),
      fragility_score: round(fragilityScore),
      identity_score: 0,
      composite_score: round(compositeScore),
      archetype: "",
      archetype_reason: "",
      last_event_date: team.last_event_date,
    };
  });

  const identityVectors = initialRecords.map((record) => [
    record.efficiency_score / 100,
    record.pressure_score / 100,
    record.discipline_score / 100,
    record.adaptability_score / 100,
    record.consistency_score / 100,
    (record.momentum_index + 100) / 200,
  ]);

  const dimensionMeans = identityVectors[0].map((_, dimension) =>
    average(identityVectors.map((vector) => vector[dimension]))
  );
  const dimensionStdDevs = identityVectors[0].map((_, dimension) => {
    const spread = stdDev(identityVectors.map((vector) => vector[dimension]));
    return spread > 0 ? spread : 1;
  });

  const identityDistances = identityVectors.map((vector) =>
    Math.sqrt(
      average(
        vector.map((value, dimension) => {
          const zScore = (value - dimensionMeans[dimension]) / dimensionStdDevs[dimension];
          return zScore ** 2;
        })
      )
    )
  );
  const identityScaled = minMaxScale(identityDistances);

  const withIdentity = initialRecords.map((record, index) => ({
    ...record,
    identity_score: round(identityScaled[index] * 100),
  }));

  const efficiencyValues = withIdentity.map((record) => record.efficiency_score);
  const consistencyValues = withIdentity.map((record) => record.consistency_score);
  const pressureValues = withIdentity.map((record) => record.pressure_score);
  const adaptabilityValues = withIdentity.map((record) => record.adaptability_score);
  const disciplineValues = withIdentity.map((record) => record.discipline_score);
  const momentumValues = withIdentity.map((record) => record.momentum_index);
  const overperformValues = withIdentity.map((record) => record.expected_vs_actual);

  const thresholds = {
    efficiency75: quantile(efficiencyValues, 0.75),
    consistency75: quantile(consistencyValues, 0.75),
    consistency25: quantile(consistencyValues, 0.25),
    pressure75: quantile(pressureValues, 0.75),
    adaptability75: quantile(adaptabilityValues, 0.75),
    adaptability40: quantile(adaptabilityValues, 0.4),
    discipline60: quantile(disciplineValues, 0.6),
    momentum60: quantile(momentumValues, 0.6),
    momentum25: quantile(momentumValues, 0.25),
    momentum75: quantile(momentumValues, 0.75),
    overperform60: quantile(overperformValues, 0.6),
  };

  const classified = withIdentity.map((record) => {
    if (record.events_attended < 4) {
      return {
        ...record,
        archetype: "Data-limited",
        archetype_reason: "Not enough events for stable profile metrics.",
      };
    }

    if (
      record.efficiency_score >= thresholds.efficiency75 &&
      record.consistency_score >= thresholds.consistency75 &&
      record.momentum_index >= thresholds.momentum60
    ) {
      return {
        ...record,
        archetype: "Front-runners",
        archetype_reason:
          "Top-quartile efficiency and consistency, with positive momentum.",
      };
    }

    if (
      record.pressure_score >= thresholds.pressure75 &&
      record.expected_vs_actual >= thresholds.overperform60
    ) {
      return {
        ...record,
        archetype: "Late-round surgeons",
        archetype_reason:
          "Strong closeout profile and frequent overperformance versus seeded expectation.",
      };
    }

    if (
      record.consistency_score <= thresholds.consistency25 &&
      (record.momentum_index <= thresholds.momentum25 ||
        record.momentum_index >= thresholds.momentum75)
    ) {
      return {
        ...record,
        archetype: "Chaos team",
        archetype_reason:
          "High variance across events creates volatile upside and downside.",
      };
    }

    if (
      record.momentum_index <= thresholds.momentum25 &&
      record.adaptability_score <= thresholds.adaptability40
    ) {
      return {
        ...record,
        archetype: "Meta prisoners",
        archetype_reason:
          "Downward trend and below-average cross-context adaptability.",
      };
    }

    if (
      record.adaptability_score >= thresholds.adaptability75 &&
      record.discipline_score >= thresholds.discipline60
    ) {
      return {
        ...record,
        archetype: "Patch adapters",
        archetype_reason: "Reliable performance across event sizes and time windows.",
      };
    }

    return {
      ...record,
      archetype: "Balanced contenders",
      archetype_reason: "No extreme profile, but stable all-around performance.",
    };
  });

  return classified
    .sort((a, b) => b.composite_score - a.composite_score)
    .map((record, index) => ({
      rank: index + 1,
      ...record,
    }));
};

async function fetchData(): Promise<void> {
  console.log("Fetching data from Supabase...");

  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .order("org_name", { ascending: true });
  if (orgError) throw orgError;

  const mappedOrgs: OrganizationRecord[] = (orgData ?? []).map((row) => {
    const region = REGION_MAP[(row.org_region ?? "").toLowerCase().trim()] ?? "";
    return {
      id: safePositiveInt(row.org_id),
      name: String(row.org_name ?? "Unknown"),
      region,
      logo: undefined,
    };
  });

  const orgPath = path.join(__dirname, "../src/data/organizations.json");
  fs.mkdirSync(path.dirname(orgPath), { recursive: true });
  fs.writeFileSync(orgPath, JSON.stringify(mappedOrgs, null, 2));
  console.log(`Saved organizations.json (${mappedOrgs.length} items)`);

  const { data: playerData, error: playerError } = await supabase
    .from("players")
    .select("*")
    .order("player_name", { ascending: true });
  if (playerError) throw playerError;

  const mappedPlayers = (playerData ?? []).map((player) => ({
    id: safePositiveInt(player.player_id),
    name: String(player.player_name ?? "Unknown"),
    link: player.player_link ?? undefined,
  }));

  const playerPath = path.join(__dirname, "../src/data/players.json");
  fs.writeFileSync(playerPath, JSON.stringify(mappedPlayers, null, 2));
  console.log(`Saved players.json (${mappedPlayers.length} items)`);

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .order("event_start_date", { ascending: false });
  if (eventError) throw eventError;

  const mappedEvents: EventRecord[] = (eventData ?? []).map((event) => ({
    id: safePositiveInt(event.event_id),
    event_name: String(event.event_name ?? "Unknown Event"),
    start_date: String(event.event_start_date ?? ""),
    end_date: String(event.end_date ?? ""),
    participants: event.participants == null ? null : safePositiveInt(event.participants),
    prize_pool: event.prize_pool == null ? null : Math.max(0, safeNumber(event.prize_pool, 0)),
    event_link: event.event_link ?? undefined,
  }));

  const eventPath = path.join(__dirname, "../src/data/events.json");
  fs.writeFileSync(eventPath, JSON.stringify(mappedEvents, null, 2));
  console.log(`Saved events.json (${mappedEvents.length} items)`);

  const { data: eventOrgData, error: eventOrgError } = await supabase
    .from("eventorgs")
    .select("event_id, org_id, placement_start, placement_end, winnings, vct_points");
  if (eventOrgError) throw eventOrgError;

  const mappedEventOrgs: EventOrgRecord[] = (eventOrgData ?? []).map((row) => ({
    event_id: safePositiveInt(row.event_id),
    org_id: safePositiveInt(row.org_id),
    placement_start:
      row.placement_start == null ? null : safePositiveInt(row.placement_start),
    placement_end: row.placement_end == null ? null : safePositiveInt(row.placement_end),
    winnings: Math.max(0, safeNumber(row.winnings, 0)),
    vct_points: Math.max(0, safeNumber(row.vct_points, 0)),
  }));

  const teamPerformance = buildTeamPerformance(
    mappedOrgs,
    mappedEvents,
    mappedEventOrgs
  );
  const performancePath = path.join(__dirname, "../src/data/teamPerformance.json");
  fs.writeFileSync(performancePath, JSON.stringify(teamPerformance, null, 2));
  console.log(`Saved teamPerformance.json (${teamPerformance.length} teams)`);
}

fetchData().catch((error) => {
  console.error("Error fetching data:", error);
  process.exit(1);
});
