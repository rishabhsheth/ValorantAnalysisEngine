import React, { useState, useMemo, useEffect } from 'react';
import { Users, Trophy, Target, TrendingUp, Calendar, MapPin, Clock } from 'lucide-react';
import RegionDropdown from '../components/RegionDropdown';
import SearchableDropdown from '../components/SearchableDropdown';
import { Region, Team, TEAMS } from '../types';
import EventHistory from "../components/EventHistory"; // adjust path if needed


const Teams: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [eventData, setEventData] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(false);


  const filteredTeams = useMemo(() => {
    if (!selectedRegion) return TEAMS;
    return TEAMS.filter(team => team.region === selectedRegion.id);
  }, [selectedRegion]);

  const teamStats = {
    100000: { wins: 0, losses: 0, winRate: 0, ranking: 0 },
    // 26: { wins: 24, losses: 8, winRate: 75, ranking: 1 },
    // 31: { wins: 22, losses: 10, winRate: 69, ranking: 2 },
    // 32: { wins: 19, losses: 13, winRate: 59, ranking: 3 },
    // 1: { wins: 26, losses: 6, winRate: 81, ranking: 1 },
    // 5: { wins: 21, losses: 11, winRate: 66, ranking: 2 },
    // 15: { wins: 23, losses: 9, winRate: 72, ranking: 1 },
    // 16: { wins: 20, losses: 12, winRate: 63, ranking: 2 },
  };

  // 🔥 Fetch event placements for selected team
  useEffect(() => {
    if (!selectedTeam) return;
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setError(null);
      try {
        const apiUrl = `https://vnmjhgvdrnjmiyzilcla.supabase.co/rest/v1/rpc/eventplacementsbyorgid?say=${selectedTeam.id}`;
        const res = await fetch(apiUrl, {
          headers: {
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpoZ3Zkcm5qbWl5emlsY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDEwNTgsImV4cCI6MjA2OTQ3NzA1OH0.Kxzakd1IrlpskVaQdqdTx4medx2TGIC8-QdQr6CRweA',
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch event data');
        const data = await res.json();
        setEventData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, [selectedTeam]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Team Analysis</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Analyze team performance, strategies, and statistics across all regions
          </p>
        </div>

        {/* FILTERS */}
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

        {/* TEAM DETAILS */}
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

            {/* BASIC STATS */}
            {teamStats[selectedTeam.id as keyof typeof teamStats] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              </div>
            )}

            {/* TIMELINE SECTION */}
            {/* TIMELINE SECTION */}
            <EventHistory eventData={eventData} loadingEvents={loadingEvents} error={error} />



          </div>
        )}

        {/* NO TEAM SELECTED */}
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
