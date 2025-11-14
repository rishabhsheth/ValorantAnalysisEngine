import React, { useState, useMemo } from "react";
import { Calendar, Users, Trophy, ChevronDown } from "lucide-react";
import { EVENTS, Event } from "../types";

const Events: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Extract years dynamically
  const years = useMemo(() => {
    const set = new Set<string>();
    EVENTS.forEach((e) => set.add(e.start_date.slice(0, 4)));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, []);

  const filteredEvents = useMemo(() => {
    return selectedYear === "all"
      ? EVENTS
      : EVENTS.filter((e) => e.start_date.startsWith(selectedYear));
  }, [selectedYear]);

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Events Overview
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Browse major Valorant events, compare participation, and explore prize pools.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-gray-800/70 border-b border-gray-700 py-6 px-4 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="h-6 w-6 text-yellow-500" />
            <span className="text-lg font-semibold">Filter by Year</span>
          </div>

          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-200 py-2 px-4 rounded-lg pr-10 cursor-pointer hover:border-gray-500 transition-all"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto mt-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 hover:border-gray-600 transition-all transform hover:scale-[1.02]"
          >
            {/* Event Title */}
            <h2 className="text-2xl font-bold text-white mb-3 hover:text-yellow-400 transition-colors">
              {event.event_name}
            </h2>

            {/* Dates */}
            <div className="flex items-center text-gray-400 mb-4 gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>
                {event.start_date} → {event.end_date}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              {/* Participants */}
              <div className="flex justify-between text-gray-300">
                <span className="text-gray-400">Participants:</span>
                <span className="font-medium text-white">
                  {event.participants ?? "N/A"}
                </span>
              </div>

              {/* Prize Pool */}
              <div className="flex justify-between text-gray-300">
                <span className="text-gray-400">Prize Pool:</span>
                <span className="font-medium text-white">
                  {event.prize_pool ? `$${event.prize_pool.toLocaleString()}` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;