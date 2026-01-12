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
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <User className="h-10 w-10 text-blue-400" />
              <div className="absolute inset-0 blur-lg opacity-50 bg-blue-400 rounded-full"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Player Analysis
            </h1>
          </div>
          <p className="text-gray-400 text-xl font-medium">
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
          <div className="bg-gradient-card rounded-2xl p-8 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl mr-4 shadow-glow-blue">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white mb-1">{selectedPlayer.name}</h2>
                {selectedPlayer.link && (
                  <a
                    href={selectedPlayer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 flex items-center gap-1 group"
                  >
                    View Profile
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                )}
              </div>
            </div>

            {selectedStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-center mb-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                        <Target className="h-5 w-5 text-purple-400" />
                      </div>
                      <span className="text-gray-300 font-semibold">Rating</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                      {selectedStats.rating}
                    </div>
                  </div>

                  <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-lg hover:shadow-yellow-500/20">
                    <div className="flex items-center mb-3">
                      <div className="bg-yellow-500/20 p-2 rounded-lg mr-3">
                        <Zap className="h-5 w-5 text-yellow-400" />
                      </div>
                      <span className="text-gray-300 font-semibold">ADR</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                      {selectedStats.adr}
                    </div>
                  </div>

                  <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-lg hover:shadow-green-500/20">
                    <div className="flex items-center mb-3">
                      <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                      <span className="text-gray-300 font-semibold">K/D</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                      {selectedStats.kd}
                    </div>
                  </div>

                  <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-glow-blue">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                        <Award className="h-5 w-5 text-blue-400" />
                      </div>
                      <span className="text-gray-300 font-semibold">ACS</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                      {selectedStats.acs}
                    </div>
                  </div>

                  <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-val-red-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-glow-red">
                    <div className="flex items-center mb-3">
                      <div className="bg-val-red-500/20 p-2 rounded-lg mr-3">
                        <Target className="h-5 w-5 text-val-red-400" />
                      </div>
                      <span className="text-gray-300 font-semibold">HS%</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                      {selectedStats.headshot}%
                    </div>
                  </div>
                </div>

                {radarData && selectedNormalizedSeries && (
                  <>
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-400" />
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

                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-400" />
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
          <div className="bg-gradient-card rounded-2xl p-12 border border-gray-800 text-center shadow-card animate-fade-in">
            <div className="relative inline-block mb-6">
              <User className="h-20 w-20 text-gray-600 mx-auto" />
              <div className="absolute inset-0 blur-2xl opacity-30 bg-gray-500 rounded-full"></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Select a Player</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Choose a player from the dropdown above to view statistics and profile links.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
