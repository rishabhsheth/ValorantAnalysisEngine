import React from "react";
import { Activity, BarChart3, Rocket, Trophy, TrendingUp } from "lucide-react";
import type { Data } from "plotly.js";
import { useNavigate } from "react-router-dom";
import PlotlyChart from "../components/PlotlyChart";
import { REGIONS, TEAM_PERFORMANCE, TeamPerformance } from "../types";

const REGION_COLORS: Record<string, string> = {
  am: "#ef4444",
  emea: "#f59e0b",
  apac: "#3b82f6",
  cn: "#10b981",
  other: "#a78bfa",
};

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const regionLabel = (regionId: string): string => {
  const region = REGIONS.find((item) => item.id === regionId);
  if (region) return region.name;
  if (!regionId) return "Unknown";
  return regionId.toUpperCase();
};

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [hideDataLimitedTeams, setHideDataLimitedTeams] = React.useState(false);
  const [selectedArchetype, setSelectedArchetype] = React.useState<string | null>(null);

  const allRankedTeams = [...TEAM_PERFORMANCE].sort(
    (a, b) => b.composite_score - a.composite_score
  );

  const dataLimitedCount = allRankedTeams.filter(
    (team) => team.events_attended < 4
  ).length;

  const rankedTeams = allRankedTeams.filter(
    (team) => !hideDataLimitedTeams || team.events_attended >= 4
  );

  if (allRankedTeams.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-card rounded-2xl p-10 border border-gray-800 text-center shadow-card">
            <BarChart3 className="h-16 w-16 text-gray-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-white mb-3">No Team Performance Data</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Run <code>npm run dev</code> or <code>tsx scripts/fetchData.ts</code> in
              the <code>client</code> folder to generate <code>teamPerformance.json</code>{" "}
              from the latest database records.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (rankedTeams.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-10 w-10 text-purple-400 mr-4" />
              <h1 className="text-5xl md:text-6xl font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Team Performance DNA
              </h1>
            </div>
            <p className="text-gray-400 text-xl font-medium mb-4">
              Dynamic team archetypes and rankings generated directly from event outcomes.
            </p>
            <label className="inline-flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-2 text-sm text-gray-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-val-red-400"
                checked={hideDataLimitedTeams}
                onChange={(event) => {
                  setHideDataLimitedTeams(event.target.checked);
                  setSelectedArchetype(null);
                }}
              />
              Hide data-limited teams (&lt;4 events)
            </label>
          </div>

          <div className="bg-gradient-card rounded-2xl p-10 border border-gray-800 text-center shadow-card">
            <h2 className="text-3xl font-black text-white mb-3">No Teams Match Current Filter</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              All available teams are currently marked data-limited. Disable the filter to
              include them in charts and rankings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const topTeam = rankedTeams[0];
  const momentumLeader = rankedTeams.reduce((best, team) =>
    team.momentum_index > best.momentum_index ? team : best
  );
  const overperformLeader = rankedTeams.reduce((best, team) =>
    team.expected_vs_actual > best.expected_vs_actual ? team : best
  );
  const topTeams = rankedTeams.slice(0, 12).reverse();
  const tableTeams = rankedTeams.slice(0, 15);

  const teamsByRegion = new Map<string, TeamPerformance[]>();
  rankedTeams.forEach((team) => {
    const key = team.region || "other";
    const bucket = teamsByRegion.get(key) ?? [];
    bucket.push(team);
    teamsByRegion.set(key, bucket);
  });

  const efficiencyConsistencyTraces: Data[] = Array.from(teamsByRegion.entries()).map(
    ([regionId, teams]) =>
      ({
      type: "scatter",
      mode: "markers",
      name: regionLabel(regionId),
      x: teams.map((team) => team.efficiency_score),
      y: teams.map((team) => team.consistency_score),
      text: teams.map(
        (team) =>
          `${team.team_name}<br>Composite: ${team.composite_score.toFixed(
            1
          )}<br>Archetype: ${team.archetype}`
      ),
      customdata: teams.map((team) => team.team_name),
      marker: {
        color: REGION_COLORS[regionId] ?? "#9ca3af",
        size: teams.map((team) => Math.max(8, Math.min(26, team.events_attended * 1.1))),
        opacity: 0.85,
      },
      hovertemplate: "%{text}<br>Efficiency: %{x:.1f}<br>Consistency: %{y:.1f}<extra></extra>",
      }) as Data
  );

  const momentumVsExpectationTrace: Data[] = [
    {
      type: "scatter",
      mode: "markers",
      x: rankedTeams.map((team) => team.momentum_index),
      y: rankedTeams.map((team) => team.expected_vs_actual),
      text: rankedTeams.map(
        (team) =>
          `${team.team_name}<br>Composite: ${team.composite_score.toFixed(
            1
          )}<br>Archetype: ${team.archetype}`
      ),
      customdata: rankedTeams.map((team) => team.team_name),
      marker: {
        size: rankedTeams.map((team) => Math.max(8, Math.min(28, team.events_attended * 1.2))),
        color: rankedTeams.map((team) => team.composite_score),
        colorscale: "Turbo",
        showscale: true,
        colorbar: { title: "Composite" },
        opacity: 0.88,
      },
      hovertemplate: "%{text}<br>Momentum: %{x:.1f}<br>Exp vs Actual: %{y:.1f}<extra></extra>",
    } as Data,
  ];

  const archetypeCounts = rankedTeams.reduce<Record<string, number>>((acc, team) => {
    acc[team.archetype] = (acc[team.archetype] ?? 0) + 1;
    return acc;
  }, {});
  const archetypeLabels = Object.keys(archetypeCounts);
  const archetypeValues = archetypeLabels.map((label) => archetypeCounts[label]);

  const compositeScoreData: Data[] = [
    {
      type: "bar",
      orientation: "h",
      y: topTeams.map((team) => team.team_name),
      x: topTeams.map((team) => team.composite_score),
      marker: { color: "#f97316" },
      text: topTeams.map((team) => team.archetype),
      hovertemplate:
        "%{y}<br>Composite: %{x:.1f}<br>Archetype: %{text}<extra></extra>",
    } as Data,
  ];

  const archetypeDistributionData: Data[] = [
    {
      type: "bar",
      x: archetypeLabels,
      y: archetypeValues,
      marker: { color: "#22c55e" },
      hovertemplate: "%{x}: %{y} teams<extra></extra>",
    } as Data,
  ];

  const openTeam = (teamName: string) => {
    navigate("/teams", { state: { teamName } });
  };

  const selectedArchetypeTeams = selectedArchetype
    ? rankedTeams.filter((team) => team.archetype === selectedArchetype)
    : [];

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-10 w-10 text-purple-400 mr-4" />
            <h1 className="text-5xl md:text-6xl font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Team Performance DNA
            </h1>
          </div>
          <p className="text-gray-400 text-xl font-medium">
            Dynamic team archetypes and rankings generated directly from event outcomes.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-2 text-sm text-gray-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-val-red-400"
                checked={hideDataLimitedTeams}
                onChange={(event) => {
                  setHideDataLimitedTeams(event.target.checked);
                  setSelectedArchetype(null);
                }}
              />
              Hide data-limited teams (&lt;4 events)
            </label>
            <span className="text-sm text-gray-400">
              {hideDataLimitedTeams
                ? `Showing ${rankedTeams.length} teams (${dataLimitedCount} hidden)`
                : `Showing ${rankedTeams.length} teams (${dataLimitedCount} data-limited available)`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <div className="flex items-center mb-3">
              <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-gray-300 font-semibold">Top Composite Team</span>
            </div>
            <button
              type="button"
              className="text-left text-2xl font-black text-white hover:text-val-red-300 transition-colors"
              onClick={() => openTeam(topTeam.team_name)}
            >
              {topTeam.team_name}
            </button>
            <p className="text-sm text-gray-400 mt-1">
              Score {topTeam.composite_score.toFixed(1)} | {topTeam.archetype}
            </p>
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-gray-300 font-semibold">Momentum Leader</span>
            </div>
            <button
              type="button"
              className="text-left text-2xl font-black text-white hover:text-val-red-300 transition-colors"
              onClick={() => openTeam(momentumLeader.team_name)}
            >
              {momentumLeader.team_name}
            </button>
            <p className="text-sm text-gray-400 mt-1">
              Momentum {momentumLeader.momentum_index.toFixed(1)}
            </p>
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <div className="flex items-center mb-3">
              <Rocket className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="text-gray-300 font-semibold">Overperformer</span>
            </div>
            <button
              type="button"
              className="text-left text-2xl font-black text-white hover:text-val-red-300 transition-colors"
              onClick={() => openTeam(overperformLeader.team_name)}
            >
              {overperformLeader.team_name}
            </button>
            <p className="text-sm text-gray-400 mt-1">
              Exp vs Actual {overperformLeader.expected_vs_actual.toFixed(1)}
            </p>
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <div className="flex items-center mb-3">
              <Activity className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-gray-300 font-semibold">Tracked Teams</span>
            </div>
            <p className="text-2xl font-black text-white">
              {numberFormatter.format(rankedTeams.length)}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {numberFormatter.format(
                rankedTeams.reduce((sum, team) => sum + team.events_attended, 0)
              )}{" "}
              team-event records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <h3 className="text-xl font-bold text-white mb-4">Composite Score Leaderboard</h3>
            <PlotlyChart
              data={compositeScoreData}
              layout={{
                height: 380,
                margin: { l: 180, r: 24, t: 20, b: 40 },
                xaxis: { title: { text: "Composite Score" } },
              }}
              onClick={(event) => {
                const pointIndex = event.points?.[0]?.pointIndex;
                if (pointIndex === undefined) return;
                const team = topTeams[pointIndex];
                if (!team) return;
                openTeam(team.team_name);
              }}
              title="Composite Score Leaderboard"
            />
            <p className="text-xs text-gray-400 mt-2">Click a bar to open that team.</p>
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <h3 className="text-xl font-bold text-white mb-4">Efficiency vs Consistency</h3>
            <PlotlyChart
              data={efficiencyConsistencyTraces}
              layout={{
                height: 380,
                xaxis: { title: { text: "Efficiency Score" } },
                yaxis: { title: { text: "Consistency Score" } },
              }}
              onClick={(event) => {
                const teamName = event.points?.[0]?.customdata;
                if (typeof teamName !== "string") return;
                openTeam(teamName);
              }}
              title="Efficiency vs Consistency"
            />
            <p className="text-xs text-gray-400 mt-2">Click a point to open that team.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <h3 className="text-xl font-bold text-white mb-4">Momentum vs Expected Performance</h3>
            <PlotlyChart
              data={momentumVsExpectationTrace}
              layout={{
                height: 380,
                xaxis: { title: { text: "Momentum Index (-100 to 100)" }, zeroline: true },
                yaxis: { title: { text: "Expected vs Actual" }, zeroline: true },
                shapes: [
                  {
                    type: "line",
                    x0: 0,
                    x1: 0,
                    y0: -100,
                    y1: 100,
                    line: { color: "#6b7280", width: 1, dash: "dot" },
                  },
                  {
                    type: "line",
                    x0: -100,
                    x1: 100,
                    y0: 0,
                    y1: 0,
                    line: { color: "#6b7280", width: 1, dash: "dot" },
                  },
                ],
              }}
              onClick={(event) => {
                const teamName = event.points?.[0]?.customdata;
                if (typeof teamName !== "string") return;
                openTeam(teamName);
              }}
              title="Momentum vs Expected Performance"
            />
            <p className="text-xs text-gray-400 mt-2">Click a point to open that team.</p>
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
            <h3 className="text-xl font-bold text-white mb-4">Archetype Distribution</h3>
            <PlotlyChart
              data={archetypeDistributionData}
              layout={{
                height: 380,
                xaxis: { title: { text: "Archetype" }, type: "category" },
                yaxis: { title: { text: "Teams" } },
              }}
              onClick={(event) => {
                const clickedArchetype = event.points?.[0]?.x;
                if (typeof clickedArchetype !== "string") return;
                setSelectedArchetype((current) =>
                  current === clickedArchetype ? null : clickedArchetype
                );
              }}
              title="Archetype Distribution"
            />
            <p className="text-xs text-gray-400 mt-2">
              Click a bar to list teams in that archetype.
            </p>
          </div>
        </div>

        {selectedArchetype && (
          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-white">
                {selectedArchetype} Teams ({selectedArchetypeTeams.length})
              </h3>
              <button
                type="button"
                className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                onClick={() => setSelectedArchetype(null)}
              >
                Clear
              </button>
            </div>
            {selectedArchetypeTeams.length === 0 ? (
              <p className="text-gray-400">No teams found for this archetype in the current view.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedArchetypeTeams.map((team) => (
                  <button
                    key={team.team_id}
                    type="button"
                    className="rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-200 hover:border-val-red-400 hover:text-val-red-300 transition-colors"
                    onClick={() => openTeam(team.team_name)}
                  >
                    {team.team_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card">
          <h3 className="text-xl font-bold text-white mb-4">Top Team Profiles</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-3 pr-4">Rank</th>
                  <th className="py-3 pr-4">Team</th>
                  <th className="py-3 pr-4">Region</th>
                  <th className="py-3 pr-4">Archetype</th>
                  <th className="py-3 pr-4">Composite</th>
                  <th className="py-3 pr-4">Momentum</th>
                  <th className="py-3 pr-4">Exp vs Actual</th>
                  <th className="py-3 pr-4">Winnings</th>
                </tr>
              </thead>
              <tbody>
                {tableTeams.map((team, index) => (
                  <tr
                    key={team.team_id}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="py-3 pr-4 font-semibold text-white">{index + 1}</td>
                    <td className="py-3 pr-4 font-semibold">
                      <button
                        type="button"
                        className="text-left text-white hover:text-val-red-300 transition-colors"
                        onClick={() => openTeam(team.team_name)}
                      >
                        {team.team_name}
                      </button>
                    </td>
                    <td className="py-3 pr-4">{regionLabel(team.region)}</td>
                    <td className="py-3 pr-4">{team.archetype}</td>
                    <td className="py-3 pr-4">{team.composite_score.toFixed(1)}</td>
                    <td className="py-3 pr-4">{team.momentum_index.toFixed(1)}</td>
                    <td className="py-3 pr-4">{team.expected_vs_actual.toFixed(1)}</td>
                    <td className="py-3 pr-4">
                      {currencyFormatter.format(Math.max(0, team.total_winnings))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
