import React, { useMemo } from "react";
import { BarChart3, TrendingUp, PieChart, Activity, Trophy } from "lucide-react";
import PlotlyChart from "../components/PlotlyChart";
import { EVENTS, REGIONS, TEAMS } from "../types";

const Analytics: React.FC = () => {
  const regionSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    TEAMS.forEach((team) => {
      counts[team.region] = (counts[team.region] ?? 0) + 1;
    });

    const knownRegions = new Set(REGIONS.map((region) => region.id));
    const labels = REGIONS.map((region) => region.name);
    const values = REGIONS.map((region) => counts[region.id] ?? 0);

    const otherCount = Object.keys(counts).reduce((sum, regionId) => {
      if (knownRegions.has(regionId)) return sum;
      return sum + (counts[regionId] ?? 0);
    }, 0);

    if (otherCount > 0) {
      labels.push("Other");
      values.push(otherCount);
    }

    return { labels, values };
  }, [REGIONS, TEAMS]);

  const eventSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    const prizeTotals: Record<string, number> = {};

    EVENTS.forEach((event) => {
      const year = event.start_date.slice(0, 4);
      counts[year] = (counts[year] ?? 0) + 1;
      prizeTotals[year] = (prizeTotals[year] ?? 0) + (event.prize_pool ?? 0);
    });

    const years = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
    return {
      years,
      eventCounts: years.map((year) => counts[year] ?? 0),
      prizeTotals: years.map((year) => prizeTotals[year] ?? 0),
    };
  }, [EVENTS]);

  const topPrizePools = useMemo(() => {
    const ranked = [...EVENTS]
      .filter((event) => (event.prize_pool ?? 0) > 0)
      .sort((a, b) => (b.prize_pool ?? 0) - (a.prize_pool ?? 0))
      .slice(0, 8);

    const labels = ranked.map((event) => event.event_name).reverse();
    const values = ranked.map((event) => event.prize_pool ?? 0).reverse();
    return { labels, values };
  }, [EVENTS]);

  const participantSummary = useMemo(() => {
    const eligible = EVENTS.filter(
      (event) => (event.participants ?? 0) > 0 && (event.prize_pool ?? 0) > 0
    );

    return {
      participants: eligible.map((event) => event.participants ?? 0),
      prizePools: eligible.map((event) => event.prize_pool ?? 0),
      labels: eligible.map((event) => event.event_name),
      sizes: eligible.map((event) =>
        Math.max(8, Math.min(24, (event.participants ?? 0) * 0.6))
      ),
    };
  }, [EVENTS]);

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-10 w-10 text-purple-400 mr-4" />
            <h1 className="text-5xl md:text-6xl font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Advanced Analytics
            </h1>
          </div>
          <p className="text-gray-400 text-xl font-medium">
            Visual breakdowns of teams, events, and prize pools using static data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                <PieChart className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Teams by Region</h3>
            </div>
            <PlotlyChart
              data={[
                {
                  type: "bar",
                  x: regionSummary.labels,
                  y: regionSummary.values,
                  marker: {
                    color: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#9ca3af"],
                  },
                  hovertemplate: "%{x}: %{y}<extra></extra>",
                },
              ]}
              layout={{ yaxis: { title: "Teams" } }}
              title="Teams by Region"
            />
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Events per Year</h3>
            </div>
            <PlotlyChart
              data={[
                {
                  type: "scatter",
                  mode: "lines+markers",
                  x: eventSummary.years,
                  y: eventSummary.eventCounts,
                  line: { color: "#60a5fa", width: 3 },
                  marker: { color: "#60a5fa", size: 6 },
                  hovertemplate: "%{x}: %{y} events<extra></extra>",
                },
              ]}
              layout={{
                xaxis: { type: "category", tickmode: "linear", dtick: 1 },
                yaxis: { title: "Events" },
              }}
              title="Events per Year"
            />
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Prize Pool by Year</h3>
            </div>
            <PlotlyChart
              data={[
                {
                  type: "scatter",
                  mode: "lines",
                  x: eventSummary.years,
                  y: eventSummary.prizeTotals,
                  fill: "tozeroy",
                  line: { color: "#f59e0b", width: 3 },
                  hovertemplate: "%{x}: $%{y:,.0f}<extra></extra>",
                },
              ]}
              layout={{
                xaxis: { type: "category", tickmode: "linear", dtick: 1 },
                yaxis: { title: "Prize Pool", tickformat: "$,.0f" },
              }}
              title="Prize Pool by Year"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500/20 p-2 rounded-lg mr-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Top Prize Pools</h3>
            </div>
            <PlotlyChart
              data={[
                {
                  type: "bar",
                  orientation: "h",
                  y: topPrizePools.labels,
                  x: topPrizePools.values,
                  marker: { color: "#f97316" },
                  hovertemplate: "%{y}: $%{x:,.0f}<extra></extra>",
                },
              ]}
              layout={{
                height: 320,
                margin: { l: 180, r: 24, t: 20, b: 40 },
                xaxis: { title: "Prize Pool", tickformat: "$,.0f" },
              }}
              title="Top Prize Pools"
            />
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-cyan-500/20 p-2 rounded-lg mr-3">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Participants vs Prize Pool
              </h3>
            </div>
            <PlotlyChart
              data={[
                {
                  type: "scatter",
                  mode: "markers",
                  x: participantSummary.participants,
                  y: participantSummary.prizePools,
                  text: participantSummary.labels,
                  marker: {
                    size: participantSummary.sizes,
                    color: "#38bdf8",
                    opacity: 0.85,
                  },
                  hovertemplate:
                    "%{text}<br>Participants: %{x}<br>Prize: $%{y:,.0f}<extra></extra>",
                },
              ]}
              layout={{
                height: 320,
                xaxis: { title: "Participants" },
                yaxis: { title: "Prize Pool", tickformat: "$,.0f" },
              }}
              title="Participants vs Prize Pool"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
