import React, { useState } from "react";
import { User, Target, Award, TrendingUp, Zap } from 'lucide-react';
import SearchableDropdown from '../components/SearchableDropdown';
import PlotlyChart from "../components/PlotlyChart";
import { Player, PLAYERS } from '../types';

type PlayerStats = {
  rating: number;
  adr: number;
  kd: number;
  acs: number;
  headshot: number;
};

const playerStats: Record<string, PlayerStats> = {
  "1": { rating: 1.23, adr: 168, kd: 1.18, acs: 245, headshot: 31 },
  "2": { rating: 1.31, adr: 172, kd: 1.25, acs: 258, headshot: 28 },
  "3": { rating: 1.28, adr: 165, kd: 1.22, acs: 251, headshot: 33 },
  "4": { rating: 1.35, adr: 178, kd: 1.29, acs: 267, headshot: 29 },
  "5": { rating: 1.32, adr: 174, kd: 1.26, acs: 261, headshot: 30 },
};

const statKeys: Array<{ key: keyof PlayerStats; label: string }> = [
  { key: "rating", label: "Rating" },
  { key: "adr", label: "ADR" },
  { key: "kd", label: "K/D" },
  { key: "acs", label: "ACS" },
  { key: "headshot", label: "HS%" },
];

const statMax: Record<keyof PlayerStats, number> = {
  rating: 0,
  adr: 0,
  kd: 0,
  acs: 0,
  headshot: 0,
};

Object.values(playerStats).forEach((stats) => {
  statMax.rating = Math.max(statMax.rating, stats.rating);
  statMax.adr = Math.max(statMax.adr, stats.adr);
  statMax.kd = Math.max(statMax.kd, stats.kd);
  statMax.acs = Math.max(statMax.acs, stats.acs);
  statMax.headshot = Math.max(statMax.headshot, stats.headshot);
});

const playerStatValues = Object.values(playerStats);
const playerStatCount = playerStatValues.length || 1;
const playerStatTotals = playerStatValues.reduce(
  (acc, stats) => ({
    rating: acc.rating + stats.rating,
    adr: acc.adr + stats.adr,
    kd: acc.kd + stats.kd,
    acs: acc.acs + stats.acs,
    headshot: acc.headshot + stats.headshot,
  }),
  { rating: 0, adr: 0, kd: 0, acs: 0, headshot: 0 }
);

const playerStatAverages: PlayerStats = {
  rating: Number((playerStatTotals.rating / playerStatCount).toFixed(2)),
  adr: Math.round(playerStatTotals.adr / playerStatCount),
  kd: Number((playerStatTotals.kd / playerStatCount).toFixed(2)),
  acs: Math.round(playerStatTotals.acs / playerStatCount),
  headshot: Math.round(playerStatTotals.headshot / playerStatCount),
};

const averageNormalizedSeries = statKeys.map(({ key }) =>
  Math.round((playerStatAverages[key] / (statMax[key] || 1)) * 100)
);

const Players: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const selectedStats = selectedPlayer
    ? playerStats[String(selectedPlayer.id)]
    : undefined;

  const selectedNormalizedSeries = selectedStats
    ? statKeys.map(({ key }) =>
        Math.round((selectedStats[key] / (statMax[key] || 1)) * 100)
      )
    : null;

  const radarData = selectedStats
    ? {
        normalized: statKeys.map(({ key }) => {
          const maxValue = statMax[key] || 1;
          return (selectedStats[key] / maxValue) * 100;
        }),
        actualValues: statKeys.map(({ key }) => selectedStats[key]),
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <User className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Player Analysis</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Comprehensive player statistics, performance metrics, and links.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Player
          </label>
          <SearchableDropdown
            items={PLAYERS}
            selectedItem={selectedPlayer}
            onItemSelect={setSelectedPlayer}
            placeholder="Choose a player"
            searchPlaceholder="Search players..."
            getItemLabel={(player) => player.name}
            getItemSubLabel={(player) => player.link ?? ''}
          />
        </div>

        {selectedPlayer && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg mr-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedPlayer.name}</h2>
                {selectedPlayer.link && (
                  <a
                    href={selectedPlayer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline mt-1 block"
                  >
                    View Profile
                  </a>
                )}
              </div>
            </div>

            {selectedStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-gray-300">Rating</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {selectedStats.rating}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-gray-300">ADR</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {selectedStats.adr}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-gray-300">K/D</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {selectedStats.kd}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-gray-300">ACS</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {selectedStats.acs}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-gray-300">HS%</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {selectedStats.headshot}%
                    </div>
                  </div>
                </div>

                {radarData && selectedNormalizedSeries && (
                  <>
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Stat Comparison
                        </h3>
                        <PlotlyChart
                          data={[
                            {
                              type: "bar",
                              x: statKeys.map((stat) => stat.label),
                              y: selectedNormalizedSeries,
                              name: selectedPlayer.name,
                              marker: { color: "#60a5fa" },
                              customdata: radarData.actualValues,
                              hovertemplate:
                                "%{x}: %{customdata} (%{y}%)<extra></extra>",
                            },
                            {
                              type: "bar",
                              x: statKeys.map((stat) => stat.label),
                              y: averageNormalizedSeries,
                              name: "Sample Avg",
                              marker: { color: "#9ca3af" },
                              customdata: statKeys.map(
                                ({ key }) => playerStatAverages[key]
                              ),
                              hovertemplate:
                                "%{x}: %{customdata} (%{y}%)<extra></extra>",
                            },
                          ]}
                          layout={{
                            height: 320,
                            barmode: "group",
                            yaxis: {
                              title: "Relative Score",
                              range: [0, 100],
                              ticksuffix: "%",
                            },
                          }}
                          title="Stat Comparison"
                        />
                      </div>

                      <div className="bg-gray-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Performance Profile
                        </h3>
                        <PlotlyChart
                          data={[
                            {
                              type: "scatterpolar",
                              r: radarData.normalized,
                              theta: statKeys.map((stat) => stat.label),
                              fill: "toself",
                              marker: { color: "#60a5fa" },
                              line: { color: "#60a5fa" },
                              customdata: radarData.actualValues,
                              hovertemplate: "%{theta}: %{customdata}<extra></extra>",
                            },
                          ]}
                          layout={{
                            height: 320,
                            showlegend: false,
                            polar: {
                              bgcolor: "rgba(0,0,0,0)",
                              radialaxis: {
                                visible: true,
                                range: [0, 100],
                                ticksuffix: "%",
                                gridcolor: "#374151",
                                tickcolor: "#6b7280",
                              },
                              angularaxis: { color: "#9CA3AF" },
                            },
                            margin: { l: 32, r: 32, t: 20, b: 20 },
                          }}
                          title="Performance Profile"
                        />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                      Normalized to top values in the static sample.
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {!selectedPlayer && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Select a Player</h3>
            <p className="text-gray-400">
              Choose a player from the dropdown above to view statistics and profile links.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
