import React, { useState, useMemo, useEffect } from 'react';
import { Users, Trophy, Target, TrendingUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
// import RegionDropdown from '../components/RegionDropdown';
import Dropdown from '../components/Dropdown';
import SearchableDropdown from '../components/SearchableDropdown';
import { Region, REGIONS, Team, TEAMS } from '../types';
import EventHistory from "../components/EventHistory"; // adjust path if needed
import PlotlyChart from '../components/PlotlyChart';


type EventPlacement = {
  event_id: number | string;
  event_name: string;
  placement_start: number;
  placement_end?: number | null;
  event_start_date: string;
  end_date: string;
};

type EventResult = {
  org_name: string;
  winnings: number | null;
};



const Teams: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [eventData, setEventData] = useState<EventPlacement[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventEarnings, setEventEarnings] = useState<Record<string, number>>({});
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [earningsError, setEarningsError] = useState<string | null>(null);
  // const [showEvents, setShowEvents] = useState(false);



  const filteredTeams = useMemo(() => {
    if (!selectedRegion) return TEAMS;
    return TEAMS.filter(team => team.region === selectedRegion.id);
  }, [selectedRegion]);

  const placementSummary = useMemo(() => {
    if (eventData.length === 0) return null;

    const sortedEvents = [...eventData].sort(
      (a, b) =>
        new Date(a.event_start_date).getTime() - new Date(b.event_start_date).getTime()
    );

    const placementSeries = sortedEvents.map((event) => {
      const endPlacement = event.placement_end ?? event.placement_start;
      const placementScore = (event.placement_start + endPlacement) / 2;
      const placementLabel =
        endPlacement !== event.placement_start
          ? `${event.placement_start}-${endPlacement}`
          : `${event.placement_start}`;

      return {
        ...event,
        placementScore,
        placementLabel,
      };
    });

    const placementScores = placementSeries
      .map((event) => event.placementScore)
      .filter((value) => Number.isFinite(value));

    if (placementScores.length === 0) return null;

    const bestPlacement = placementSeries.reduce((best, event) => {
      const endPlacement = event.placement_end ?? event.placement_start;
      const bestForEvent = Math.min(event.placement_start, endPlacement);
      return Math.min(best, bestForEvent);
    }, Number.POSITIVE_INFINITY);

    const avgPlacement =
      placementScores.reduce((sum, value) => sum + value, 0) / placementScores.length;

    const podiumFinishes = placementSeries.filter((event) => {
      const endPlacement = event.placement_end ?? event.placement_start;
      return Math.min(event.placement_start, endPlacement) <= 3;
    }).length;

    const yearCounts = placementSeries.reduce<Record<string, number>>((acc, event) => {
      const year = event.event_start_date.slice(0, 4);
      acc[year] = (acc[year] ?? 0) + 1;
      return acc;
    }, {});

    const yearLabels = Object.keys(yearCounts).sort((a, b) => Number(a) - Number(b));
    const yearValues = yearLabels.map((year) => yearCounts[year]);

    const distributionMap = new Map<
      string,
      { label: string; start: number; end: number; count: number }
    >();

    placementSeries.forEach((event) => {
      const start = Math.max(1, event.placement_start);
      const end = Math.max(start, event.placement_end ?? event.placement_start);
      const label = end === start ? `${start}` : `${start}-${end}`;
      const current = distributionMap.get(label) ?? {
        label,
        start,
        end,
        count: 0,
      };
      current.count += 1;
      distributionMap.set(label, current);
    });

    const distributionBuckets = Array.from(distributionMap.values()).sort(
      (a, b) => a.start - b.start || a.end - b.end
    );

    const distributionLabels = distributionBuckets.map((bucket) => bucket.label);
    const distributionCounts = distributionBuckets.map((bucket) => bucket.count);

    return {
      placementSeries,
      bestPlacement,
      avgPlacement,
      podiumFinishes,
      eventsAttended: placementSeries.length,
      yearLabels,
      yearValues,
      distributionLabels,
      distributionCounts,
    };
  }, [eventData]);

  useEffect(() => {
    const teamNameFromNav = location.state?.teamName as string | undefined;
    if (!teamNameFromNav) return;
    const normalized = teamNameFromNav.trim().toLowerCase();
    const matchedTeam = TEAMS.find(
      (team) => team.name.trim().toLowerCase() === normalized
    );
    if (!matchedTeam) return;
    setSelectedTeam(matchedTeam);
    const matchedRegion = REGIONS.find((region) => region.id === matchedTeam.region);
    setSelectedRegion(matchedRegion ?? null);
  }, [location.state]);

  const handlePlacementClick = (pointIndex?: number) => {
    if (!placementSummary || pointIndex === undefined) return;
    const targetEvent = placementSummary.placementSeries[pointIndex];
    if (!targetEvent) return;
    const numericId = Number(targetEvent.event_id);
    navigate("/events", {
      state: {
        eventId: Number.isNaN(numericId) ? targetEvent.event_id : numericId,
      },
    });
  };

  useEffect(() => {
    if (!selectedTeam || eventData.length === 0) {
      setEventEarnings({});
      setEarningsError(null);
      return;
    }

    let isActive = true;

    const fetchEarnings = async () => {
      setLoadingEarnings(true);
      setEarningsError(null);
      try {
        const teamName = selectedTeam.name.trim().toLowerCase();
        const results = await Promise.all(
          eventData.map(async (event) => {
            const apiUrl = `https://vnmjhgvdrnjmiyzilcla.supabase.co/rest/v1/rpc/resultsbyevent?say=${event.event_id}`;
            const res = await fetch(apiUrl, {
              headers: {
                apikey:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpoZ3Zkcm5qbWl5emlsY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDEwNTgsImV4cCI6MjA2OTQ3NzA1OH0.Kxzakd1IrlpskVaQdqdTx4medx2TGIC8-QdQr6CRweA',
                'Content-Type': 'application/json',
              },
            });

            if (!res.ok) {
              throw new Error(`Failed to fetch earnings for event ${event.event_id}`);
            }

            const data: EventResult[] = await res.json();
            const match = data.find(
              (row) => row.org_name?.trim().toLowerCase() === teamName
            );

            return {
              eventId: String(event.event_id),
              winnings: match?.winnings ?? 0,
            };
          })
        );

        if (!isActive) return;

        const earningsMap: Record<string, number> = {};
        results.forEach(({ eventId, winnings }) => {
          earningsMap[eventId] = winnings ?? 0;
        });

        setEventEarnings(earningsMap);
      } catch (err: any) {
        if (!isActive) return;
        setEarningsError(err.message ?? 'Failed to load earnings data');
        setEventEarnings({});
      } finally {
        if (isActive) setLoadingEarnings(false);
      }
    };

    fetchEarnings();

    return () => {
      isActive = false;
    };
  }, [eventData, selectedTeam]);

  const earningsSummary = useMemo(() => {
    if (eventData.length === 0) return null;

    const yearTotals = eventData.reduce<Record<string, number>>((acc, event) => {
      const year = event.event_start_date.slice(0, 4);
      const winnings = eventEarnings[String(event.event_id)] ?? 0;
      acc[year] = (acc[year] ?? 0) + winnings;
      return acc;
    }, {});

    const yearLabels = Object.keys(yearTotals).sort((a, b) => Number(a) - Number(b));
    if (yearLabels.length === 0) return null;

    const yearValues = yearLabels.map((year) => yearTotals[year]);

    return {
      yearLabels,
      yearValues,
    };
  }, [eventData, eventEarnings]);

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
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center mb-6">
            <Users className="h-10 w-10 text-val-red-400 mr-4" />
            <h1 className="text-5xl md:text-6xl font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Team Analysis
            </h1>
          </div>
          <p className="text-gray-400 text-xl font-medium">
            Analyze team performance, strategies, and statistics across all regions
          </p>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Region
            </label>
            <Dropdown
              items={Object.values(REGIONS)}
              selectedItem={selectedRegion}
              onItemSelect={setSelectedRegion}
              getItemLabel={(region) => region.name}
              placeholder="Select Region"
              allOptionLabel="All Regions"
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
          <div className="bg-gradient-card rounded-2xl p-8 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-val-red-500 to-orange-500 p-4 rounded-xl mr-4 shadow-lg shadow-red-500/20">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white mb-1">{selectedTeam.name}</h2>
                <p className="text-gray-400 text-lg font-semibold">
                  Region: <span className="text-val-red-400">{selectedTeam.region.toUpperCase()}</span>
                </p>
              </div>
            </div>

            {/* BASIC STATS */}
            {placementSummary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-gray-300 font-semibold">Events Attended</span>
                  </div>
                  <div className="text-4xl font-black text-white">
                    {placementSummary.eventsAttended}
                  </div>
                </div>

                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-lg hover:shadow-yellow-500/20">
                  <div className="flex items-center mb-3">
                    <div className="bg-yellow-500/20 p-2 rounded-lg mr-3">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                    </div>
                    <span className="text-gray-300 font-semibold">Best Placement</span>
                  </div>
                  <div className="text-4xl font-black text-white">
                    {placementSummary.bestPlacement}
                  </div>
                </div>

                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-lg hover:shadow-green-500/20">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="text-gray-300 font-semibold">Avg Placement</span>
                  </div>
                  <div className="text-4xl font-black text-white">
                    {placementSummary.avgPlacement.toFixed(2)}
                  </div>
                </div>

                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-val-red-500 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-lg hover:shadow-red-500/20">
                  <div className="flex items-center mb-3">
                    <div className="bg-val-red-500/20 p-2 rounded-lg mr-3">
                      <Target className="h-5 w-5 text-val-red-400" />
                    </div>
                    <span className="text-gray-300 font-semibold">Podium Finishes</span>
                  </div>
                  <div className="text-4xl font-black text-white">
                    {placementSummary.podiumFinishes}
                  </div>
                </div>
              </div>
            )}

            {placementSummary && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Placement Trend
                  </h3>
                  <PlotlyChart
                    data={[
                      {
                        type: "scatter",
                        mode: "lines+markers",
                        x: placementSummary.placementSeries.map(
                          (event) => event.event_start_date
                        ),
                        y: placementSummary.placementSeries.map(
                          (event) => event.placementScore
                        ),
                        text: placementSummary.placementSeries.map(
                          (event) =>
                            `${event.event_name}<br>Placement: ${event.placementLabel}`
                        ),
                        line: { color: "#60a5fa", width: 3 },
                        marker: { color: "#60a5fa", size: 6 },
                        hovertemplate: "%{text}<extra></extra>",
                      },
                    ]}
                    layout={{
                      height: 300,
                      xaxis: { title: "Event Start", type: "date" },
                      yaxis: {
                        title: "Placement (lower is better)",
                        autorange: "reversed",
                      },
                    }}
                    onClick={(event) =>
                      handlePlacementClick(event.points?.[0]?.pointIndex)
                    }
                    title="Placement Trend"
                  />
                  <p className="text-xs text-gray-400 mt-3">
                    Click a point to open that event in the Events page.
                  </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-400" />
                    Placement Distribution
                  </h3>
                  <PlotlyChart
                    data={[
                      {
                        type: "bar",
                        x: placementSummary.distributionLabels,
                        y: placementSummary.distributionCounts,
                        marker: { color: "#f97316" },
                        hovertemplate: "Placement %{x}: %{y} event(s)<extra></extra>",
                      },
                    ]}
                    layout={{
                      height: 340,
                      xaxis: {
                        title: "Placement",
                        type: "category",
                        automargin: true,
                      },
                      yaxis: { title: "Events" },
                    }}
                    title="Placement Distribution"
                  />
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-400" />
                    Earnings by Year
                  </h3>
                  {loadingEarnings && (
                    <p className="text-gray-400">Loading earnings data...</p>
                  )}
                  {earningsError && (
                    <p className="text-red-400">Error: {earningsError}</p>
                  )}
                  {!loadingEarnings && !earningsError && earningsSummary && (
                    <PlotlyChart
                      data={[
                        {
                          type: "bar",
                          x: earningsSummary.yearLabels,
                          y: earningsSummary.yearValues,
                          marker: { color: "#38bdf8" },
                          hovertemplate: "%{x}: $%{y:,.0f}<extra></extra>",
                        },
                      ]}
                      layout={{
                        height: 300,
                        xaxis: { type: "category", tickmode: "linear", dtick: 1 },
                        yaxis: { title: "Earnings", tickformat: "$,.0f" },
                      }}
                      title="Earnings by Year"
                    />
                  )}
                  {!loadingEarnings &&
                    !earningsError &&
                    !earningsSummary && (
                      <p className="text-gray-400">No earnings data available.</p>
                    )}
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-400" />
                    Events by Year
                  </h3>
                  <PlotlyChart
                    data={[
                      {
                        type: "bar",
                        x: placementSummary.yearLabels,
                        y: placementSummary.yearValues,
                        marker: { color: "#22c55e" },
                        hovertemplate: "%{x}: %{y}<extra></extra>",
                      },
                    ]}
                    layout={{
                      height: 300,
                      xaxis: { type: "category", tickmode: "linear", dtick: 1 },
                      yaxis: { title: "Events" },
                    }}
                    title="Events by Year"
                  />
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
          <div className="bg-gradient-card rounded-2xl p-12 border border-gray-800 text-center shadow-card animate-fade-in">
            <Users className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-3">Select a Team</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Choose a region and team from the dropdowns above to view detailed analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
