import React, { useState, useMemo } from 'react';
import { User, Target, Award, TrendingUp, Zap } from 'lucide-react';
import RegionDropdown from '../components/RegionDropdown';
import SearchableDropdown from '../components/SearchableDropdown';
import { Region, Player, MOCK_PLAYERS } from '../types';

const Players: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const filteredPlayers = useMemo(() => {
    if (!selectedRegion) return MOCK_PLAYERS;
    return MOCK_PLAYERS.filter(player => player.region === selectedRegion.id);
  }, [selectedRegion]);

  const playerStats = {
    'tenz': { rating: 1.23, adr: 168, kd: 1.18, acs: 245, headshot: 31 },
    'zekken': { rating: 1.31, adr: 172, kd: 1.25, acs: 258, headshot: 28 },
    'demon1': { rating: 1.28, adr: 165, kd: 1.22, acs: 251, headshot: 33 },
    'aspas': { rating: 1.35, adr: 178, kd: 1.29, acs: 267, headshot: 29 },
    'derke': { rating: 1.32, adr: 174, kd: 1.26, acs: 261, headshot: 30 },
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <User className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Player Analysis</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Comprehensive player statistics, performance metrics, and career insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Region
            </label>
            <RegionDropdown
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              placeholder="All Regions"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Player
            </label>
            <SearchableDropdown
              items={filteredPlayers}
              selectedItem={selectedPlayer}
              onItemSelect={setSelectedPlayer}
              placeholder="Choose a player"
              searchPlaceholder="Search players..."
              getItemLabel={(player) => player.name}
              getItemSubLabel={(player) => `${player.realName} • ${player.team} • ${player.role}`}
            />
          </div>
        </div>

        {selectedPlayer && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg mr-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedPlayer.name}</h2>
                <p className="text-gray-400">{selectedPlayer.realName}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                    {selectedPlayer.team}
                  </span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                    {selectedPlayer.role}
                  </span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                    {selectedPlayer.region.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {playerStats[selectedPlayer.id as keyof typeof playerStats] && (
                <>
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-gray-300">Rating</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {playerStats[selectedPlayer.id as keyof typeof playerStats].rating}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-gray-300">ADR</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {playerStats[selectedPlayer.id as keyof typeof playerStats].adr}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-gray-300">K/D</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {playerStats[selectedPlayer.id as keyof typeof playerStats].kd}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-gray-300">ACS</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {playerStats[selectedPlayer.id as keyof typeof playerStats].acs}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-gray-300">HS%</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {playerStats[selectedPlayer.id as keyof typeof playerStats].headshot}%
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Performance Overview</h3>
                <div className="bg-gray-700 rounded-lg p-6">
                  <p className="text-gray-400">
                    Detailed performance charts and match history will be displayed here.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Agent Statistics</h3>
                <div className="bg-gray-700 rounded-lg p-6">
                  <p className="text-gray-400">
                    Agent-specific performance metrics and playtime distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedPlayer && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Select a Player</h3>
            <p className="text-gray-400">
              Choose a region and player from the dropdowns above to view detailed statistics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;