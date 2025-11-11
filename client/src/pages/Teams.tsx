import React, { useState, useMemo, useEffect } from 'react';
import { Users, Trophy, Target, TrendingUp, Calendar, MapPin, Clock } from 'lucide-react';
import RegionDropdown from '../components/RegionDropdown';
import SearchableDropdown from '../components/SearchableDropdown';
import { Region, Team, TEAMS } from '../types';

const Teams: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [eventData, setEventData] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Event History</h3>

              {loadingEvents ? (
                <p className="text-gray-400">Loading event data...</p>
              ) : error ? (
                <p className="text-red-400">Error: {error}</p>
              ) : eventData.length === 0 ? (
                <p className="text-gray-400">No event data found for this team.</p>
              ) : (
                (() => {
                  const sortedEvents = [...eventData].sort(
                    (a, b) => new Date(a.event_start_date).getTime() - new Date(b.event_start_date).getTime()
                  );

                  const startDate = new Date(sortedEvents[0].event_start_date);
                  const endDate = new Date(sortedEvents[sortedEvents.length - 1].end_date);

                  // proportional spacing constants
                  const cardHeight = 120;
                  const pxPerMonth = cardHeight * 1.5; // 180px per month
                  const paddingTop = 150;
                  const paddingBottom = 150;

                  const totalMonths =
                    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                    (endDate.getMonth() - startDate.getMonth());

                  const totalHeight = totalMonths * pxPerMonth + paddingTop + paddingBottom;

                  const getOffset = (dateStr: string) => {
                    const date = new Date(dateStr);
                    const diffMonths =
                      (date.getFullYear() - startDate.getFullYear()) * 12 +
                      (date.getMonth() - startDate.getMonth());
                    return paddingTop + diffMonths * pxPerMonth;
                  };

                  // month labels every 3 months
                  const months: { label: string; top: number }[] = [];
                  const tick = new Date(startDate);
                  while (tick <= endDate) {
                    const diffMonths =
                      (tick.getFullYear() - startDate.getFullYear()) * 12 +
                      (tick.getMonth() - startDate.getMonth());
                    months.push({
                      label: tick.toLocaleString('default', { month: 'short', year: 'numeric' }),
                      top: paddingTop + diffMonths * pxPerMonth,
                    });
                    tick.setMonth(tick.getMonth() + 1);
                  }

                  return (
                    <div
                      className="relative overflow-y-auto bg-gray-800 rounded-lg p-8 border border-gray-700"
                      style={{ height: "750px" }}
                    >
                      {/* Subtle vertical timeline line */}
                      <div
                        className="absolute left-32 w-[2px] bg-gray-700"
                        style={{
                          top: 0,
                          height: `${totalHeight}px`,
                          // boxShadow: "0 0 10px rgba(255,100,100,0.15)", // faint red glow
                        }}
                      />

                      {/* Month labels */}
                      {months.map((m, i) => (
                        <div
                          key={i}
                          className="absolute left-8 text-gray-500 text-sm select-none"
                          style={{ top: `${m.top}px`, transform: "translateY(-50%)" }}
                        >
                          {m.label}
                          <div className="ml-24 w-3 h-[2px] bg-gray-600 mt-1" />
                        </div>
                      ))}

                      {/* Event cards */}
                      {/* Event cards */}
                      {sortedEvents.map((event, i) => {
                        const yOffset = getOffset(event.event_start_date);
                        return (
                          <div
                            key={i}
                            className="absolute left-40 w-[calc(100%-12rem)]"
                            style={{ top: `${yOffset}px`, transform: "translateY(-50%)" }}
                          >
                            <div className="relative bg-gray-700 rounded-lg p-5 shadow-md hover:shadow-red-500/20 border border-gray-600 transition-all duration-300">
                              {/* Subtle connector dot */}
                              {/* <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-500 rounded-full border-4 border-gray-900 shadow-[0_0_8px_rgba(255,100,100,0.2)]" /> */}

                              <h4 className="text-2xl font-semibold text-white mb-2">{event.event_name}</h4>
                              <div className="flex flex-wrap gap-3 text-gray-400 text-sm mb-3">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />{" "}
                                  {new Date(event.event_start_date).toLocaleDateString()} -{" "}
                                  {new Date(event.end_date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Trophy className="h-4 w-4 mr-1 text-yellow-400" /> Placement:{" "}
                                  {event.placement_start}
                                  {event.placement_end && event.placement_end !== event.placement_start
                                    ? `–${event.placement_end}`
                                    : ""}
                                </span>
                              </div>
                              <div className="text-gray-300">
                                Event ID:{" "}
                                <span className="font-mono text-gray-400">{event.event_org_id}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    </div>
                  );
                })()
              )}
            </div>

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
