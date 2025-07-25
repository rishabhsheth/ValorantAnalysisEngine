import React, { useState, useMemo } from 'react';
import { Users, Trophy, Target, TrendingUp } from 'lucide-react';
import RegionDropdown from '../components/RegionDropdown';
import SearchableDropdown from '../components/SearchableDropdown';
import { Region, Team, MOCK_TEAMS } from '../types';

const Teams: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const filteredTeams = useMemo(() => {
    if (!selectedRegion) return MOCK_TEAMS;
    return MOCK_TEAMS.filter(team => team.region === selectedRegion.id);
  }, [selectedRegion]);

  const teamStats = {
    'sen': { wins: 24, losses: 8, winRate: 75, ranking: 1 },
    'nrg': { wins: 22, losses: 10, winRate: 69, ranking: 2 },
    'c9': { wins: 19, losses: 13, winRate: 59, ranking: 3 },
    'fnc': { wins: 26, losses: 6, winRate: 81, ranking: 1 },
    'navi': { wins: 21, losses: 11, winRate: 66, ranking: 2 },
    'prx': { wins: 23, losses: 9, winRate: 72, ranking: 1 },
    'drx': { wins: 20, losses: 12, winRate: 63, ranking: 2 },
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Team Analysis</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Analyze team performance, strategies, and statistics across all regions
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
              Select Team
            </label>
            <SearchableDropdown
              items={filteredTeams}
              selectedItem={selectedTeam}
              onItemSelect={setSelectedTeam}
              placeholder="Choose a team"
              searchPlaceholder="Search teams..."
              getItemLabel={(team) => team.name}
              getItemSubLabel={(team) => `Region: ${team.region.toUpperCase()}`}
            />
          </div>
        </div>

        {selectedTeam && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg mr-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedTeam.name}</h2>
                <p className="text-gray-400">Region: {selectedTeam.region.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamStats[selectedTeam.id as keyof typeof teamStats] && (
                <>
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-gray-300">Wins</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {teamStats[selectedTeam.id as keyof typeof teamStats].wins}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-gray-300">Losses</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {teamStats[selectedTeam.id as keyof typeof teamStats].losses}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-gray-300">Win Rate</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {teamStats[selectedTeam.id as keyof typeof teamStats].winRate}%
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-gray-300">Regional Rank</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      #{teamStats[selectedTeam.id as keyof typeof teamStats].ranking}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Recent Performance</h3>
              <div className="bg-gray-700 rounded-lg p-6">
                <p className="text-gray-400">
                  Detailed analytics and performance metrics will be displayed here once connected to your data source.
                </p>
              </div>
            </div>
          </div>
        )}

        {!selectedTeam && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Select a Team</h3>
            <p className="text-gray-400">
              Choose a region and team from the dropdowns above to view detailed analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;