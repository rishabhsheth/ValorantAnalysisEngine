import React, { useState } from 'react';
import { User, Target, Award, TrendingUp, Zap } from 'lucide-react';
import SearchableDropdown from '../components/SearchableDropdown';
import { Player, PLAYERS } from '../types';

const Players: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const playerStats: Record<string, {
  rating: number;
  adr: number;
  kd: number;
  acs: number;
  headshot: number;
}> = {
  "1": { rating: 1.23, adr: 168, kd: 1.18, acs: 245, headshot: 31 },
  "2": { rating: 1.31, adr: 172, kd: 1.25, acs: 258, headshot: 28 },
  "3": { rating: 1.28, adr: 165, kd: 1.22, acs: 251, headshot: 33 },
  "4": { rating: 1.35, adr: 178, kd: 1.29, acs: 267, headshot: 29 },
  "5": { rating: 1.32, adr: 174, kd: 1.26, acs: 261, headshot: 30 },
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

            {playerStats[selectedPlayer.id] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-gray-300">Rating</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {playerStats[selectedPlayer.id].rating}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-gray-300">ADR</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {playerStats[selectedPlayer.id].adr}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-gray-300">K/D</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {playerStats[selectedPlayer.id].kd}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-gray-300">ACS</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {playerStats[selectedPlayer.id].acs}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-gray-300">HS%</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {playerStats[selectedPlayer.id].headshot}%
                  </div>
                </div>
              </div>
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
