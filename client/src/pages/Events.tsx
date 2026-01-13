import React, { useState, useMemo, useEffect } from "react";
import { Trophy, Calendar } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ import
import SearchableDropdown from "../components/SearchableDropdown";
import Dropdown from "../components/Dropdown";
import { EVENTS, Event } from "../types";
import { EventPlacement } from "../types";
import Collapsible from "../components/Collapsible";




const Events: React.FC = () => {
  const location = useLocation(); // ✅ get router state
  const eventIdFromNav = location.state?.eventId;
  // console.log("Event ID from navigation:", eventIdFromNav); // ✅ debug log


  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventPlacements, setEventPlacements] = useState<EventPlacement[]>([]);
  const [loadingPlacements, setLoadingPlacements] = useState(false);
  const [placementError, setPlacementError] = useState<string | null>(null);

  useEffect(() => {
    if (eventIdFromNav) {
      const event = EVENTS.find((e) => e.id === eventIdFromNav);
      if (event) setSelectedEvent(event);
    }
    // console.log("Selected Event after effect:", selectedEvent); // ✅ debug log
  }, [eventIdFromNav]);



  // Extract years dynamically
  const years = useMemo(() => {
    const set = new Set<string>();
    EVENTS.forEach((e) => set.add(e.start_date.slice(0, 4)));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, []);

  // Filter events by year
  const filteredEventsByYear = useMemo(() => {
    return selectedYear === "all"
      ? EVENTS
      : EVENTS.filter((e) => e.start_date.startsWith(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedEvent) return;

    const fetchPlacements = async () => {
      setLoadingPlacements(true);
      setPlacementError(null);

      try {
        const apiUrl = `https://vnmjhgvdrnjmiyzilcla.supabase.co/rest/v1/rpc/resultsbyevent?say=${selectedEvent.id}`;
        const res = await fetch(apiUrl, {
          headers: {
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpoZ3Zkcm5qbWl5emlsY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDEwNTgsImV4cCI6MjA2OTQ3NzA1OH0.Kxzakd1IrlpskVaQdqdTx4medx2TGIC8-QdQr6CRweA",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch event placements");
        const data: EventPlacement[] = await res.json();
        setEventPlacements(data);
      } catch (err: any) {
        setPlacementError(err.message);
      } finally {
        setLoadingPlacements(false);
      }
    };

    fetchPlacements();
  }, [selectedEvent]);


  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center mb-6">
            <Trophy className="h-10 w-10 text-yellow-400 mr-4" />
            <h1 className="text-5xl md:text-6xl font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Events Overview
            </h1>
          </div>
          <p className="text-gray-400 text-xl font-medium">
            Browse Valorant events, compare participation, and explore prize pools.
          </p>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Year
            </label>
            <Dropdown
              items={years}
              selectedItem={selectedYear === "all" ? null : selectedYear}
              onItemSelect={(year) => setSelectedYear(year ?? "all")}
              getItemLabel={(year) => year}
              placeholder="Select Year"
              allOptionLabel="All Years"
            />
          </div>

          {/* Event Search Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Event
            </label>
            <SearchableDropdown
              items={filteredEventsByYear}
              selectedItem={selectedEvent}
              onItemSelect={setSelectedEvent}
              placeholder="Select Event"
              searchPlaceholder="Search events..."
              getItemLabel={(e) => e.event_name}
              getItemSubLabel={(e) => `${e.start_date} → ${e.end_date}`}
            />
          </div>
        </div>

        {/* EVENT CARD */}
        {selectedEvent && (
          <div className="bg-gradient-card rounded-2xl p-8 border border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in">
            {/* Header */}
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl mr-4 shadow-lg shadow-yellow-500/20">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div>
                {selectedEvent.event_link ? (
                  <a
                    href={selectedEvent.event_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-4xl font-black text-blue-400 hover:text-blue-300 transition-colors duration-300 group flex items-center gap-2"
                  >
                    {selectedEvent.event_name}
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                ) : (
                  <h2 className="text-4xl font-black text-white">
                    {selectedEvent.event_name}
                  </h2>
                )}
                <p className="text-gray-400 text-lg font-semibold mt-1">
                  {selectedEvent.start_date} → {selectedEvent.end_date}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="text-gray-400 font-semibold mb-2">Participants</div>
                <div className="text-white text-3xl font-black">
                  {selectedEvent.participants ?? "N/A"}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300">
                <div className="text-gray-400 font-semibold mb-2">Prize Pool</div>
                <div className="text-white text-3xl font-black">
                  {selectedEvent.prize_pool
                    ? `$${selectedEvent.prize_pool.toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Placements Table */}
            {/* <div className="mt-6">
              {loadingPlacements && <p className="text-gray-400">Loading placements...</p>}
              {placementError && <p className="text-red-500">{placementError}</p>}
              {!loadingPlacements && !placementError && eventPlacements.length > 0 && (
                <table className="w-full text-left text-white border-collapse">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 px-3">Org Name</th>
                      <th className="py-2 px-3">Region</th>
                      <th className="py-2 px-3">Placement Start</th>
                      <th className="py-2 px-3">Placement End</th>
                      <th className="py-2 px-3">Winnings</th>
                      <th className="py-2 px-3">VCT Points</th>
                      <th className="py-2 px-3">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventPlacements.map((ep, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        <td className="py-2 px-3">{ep.org_name}</td>
                        <td className="py-2 px-3">{ep.org_region}</td>
                        <td className="py-2 px-3">{ep.placement_start}</td>
                        <td className="py-2 px-3">{ep.placement_end}</td>
                        <td className="py-2 px-3">
                          {ep.winnings ? `$${ep.winnings.toLocaleString()}` : "N/A"}
                        </td>
                        <td className="py-2 px-3">{ep.vct_points ?? "N/A"}</td>
                        <td className="py-2 px-3">
                          <a
                            href={ep.org_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 underline"
                          >
                            Link
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loadingPlacements && !placementError && eventPlacements.length === 0 && (
                <p className="text-gray-400">No placement data available.</p>
              )}
            </div> */}
            <Collapsible title="Event Placements" defaultOpen={true} className="mt-6">
              {loadingPlacements && <p className="text-gray-400">Loading placements...</p>}
              {placementError && <p className="text-red-500">{placementError}</p>}

              {!loadingPlacements && !placementError && eventPlacements.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left text-white">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="py-3 px-4 font-medium">Placement</th>
                        <th className="py-3 px-4 font-medium">Org Name</th>
                        <th className="py-3 px-4 font-medium">Region</th>
                        <th className="py-3 px-4 font-medium">Winnings</th>
                        <th className="py-3 px-4 font-medium">VCT Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventPlacements.map((ep, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-700 cursor-pointer ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                            } hover:bg-gray-700 transition-colors`}
                          onClick={() => navigate("/analytics")}
                        >
                          <td className="py-2 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded-full font-bold text-sm
      ${ep.placement_start === 1 ? "bg-yellow-400 text-black" :
                                  ep.placement_start === 2 ? "bg-gray-400 text-black" :
                                    ep.placement_start === 3 ? "bg-yellow-800 text-white" :
                                      "bg-gray-700 text-white"
                                }`}
                            >
                              {ep.placement_start === ep.placement_end
                                ? ep.placement_start
                                : `${ep.placement_start}-${ep.placement_end}`}
                            </span>
                          </td>

                          <td className="py-2 px-4">
                            <Link
                              to="/teams"
                              state={{ teamName: ep.org_name }}
                              className="text-blue-400 visited:text-purple-400 underline hover:text-blue-600"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {ep.org_name}
                            </Link>
                          </td>
                          <td className="py-2 px-4">{ep.org_region}</td>
                          <td className="py-2 px-4">
                            {ep.winnings ? `$${ep.winnings.toLocaleString()}` : "$0"}
                          </td>
                          <td className="py-2 px-4">{ep.vct_points ?? "0"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loadingPlacements && !placementError && eventPlacements.length === 0 && (
                <p className="text-gray-400">No placement data available.</p>
              )}
            </Collapsible>


            {/* Link */}
            {/* {selectedEvent.event_link && (
              <a
                href={selectedEvent.event_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 visited:text-purple-400 underline hover:text-blue-600"
              >
                View Event
              </a>
            )} */}
          </div>
        )}

        {/* NO EVENT SELECTED */}
        {!selectedEvent && (
          <div className="bg-gradient-card rounded-2xl p-12 border border-gray-800 text-center shadow-card animate-fade-in">
            <Trophy className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-3">Select an Event</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Choose a year and then select an event from the dropdown to view details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
