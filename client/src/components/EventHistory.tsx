import { useState } from "react";
import { Calendar, Trophy, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Event {
  event_name: string;
  event_start_date: string;
  end_date: string;
  event_id: string;
  placement_start: number;
  placement_end?: number;
}

interface EventHistoryProps {
  eventData: Event[];
  loadingEvents: boolean;
  error: string | null;
}

const EventHistory: React.FC<EventHistoryProps> = ({ eventData, loadingEvents, error }) => {
  const [showEvents, setShowEvents] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="mt-6 rounded-xl overflow-hidden border border-gray-700">
      {/* Header Button */}
      <button
        onClick={() => setShowEvents((prev) => !prev)}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-700 hover:bg-gray-600 transition"
      >
        <h3 className="text-lg font-semibold text-white">Event History</h3>
        {showEvents ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Collapsible Content */}
      {showEvents && (
        <div className="">
          {loadingEvents ? (
            <p className="text-gray-400">Loading event data...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : eventData.length === 0 ? (
            <p className="text-gray-400">No event data found for this team.</p>
          ) : (
            (() => {
              const sortedEvents = [...eventData].sort(
                (a, b) =>
                  new Date(a.event_start_date).getTime() - new Date(b.event_start_date).getTime()
              );

              const startDate = new Date(sortedEvents[0].event_start_date);
              const endDate = new Date(sortedEvents[sortedEvents.length - 1].end_date);

              const cardHeight = 120;
              const pxPerMonth = cardHeight * 1.5;
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

              const months: { label: string; top: number }[] = [];
              const tick = new Date(startDate);
              while (tick <= endDate) {
                const diffMonths =
                  (tick.getFullYear() - startDate.getFullYear()) * 12 +
                  (tick.getMonth() - startDate.getMonth());
                months.push({
                  label: tick.toLocaleString("default", { month: "short", year: "numeric" }),
                  top: paddingTop + diffMonths * pxPerMonth,
                });
                tick.setMonth(tick.getMonth() + 1);
              }

              return (
                <div
                  className="relative overflow-y-auto bg-gray-800 p-8 max-h-[750px]"
                  style={{ height: "750px" }}
                >
                  {/* Vertical line */}
                  <div
                    className="absolute left-32 w-[2px] bg-gray-700"
                    style={{ height: `${totalHeight}px` }}
                  />

                  {/* Month labels */}
                  {months.map((m, i) => (
                    <div
                      key={i}
                      className="absolute left-8 text-gray-500 text-sm select-none"
                      style={{ top: `${m.top}px`, transform: "translateY(-50%)" }}
                    >
                      {m.label}
                      <div className="absolute right-0 top-1/2 w-3 h-[2px] bg-gray-600"
                        style={{
                          left: '96px', // 128px (left-32) - 32px (left-8) = 96px
                          transform: 'translateY(-50%)'
                        }}
                      />
                    </div>
                  ))}

                  {/* Event cards */}
                  {sortedEvents.map((event, i) => {
                    const yOffset = getOffset(event.event_start_date);
                    return (
                      <div
                        key={i}
                        className="absolute left-40 w-[calc(100%-12rem)] cursor-pointer"
                        style={{ top: `${yOffset}px`, transform: "translateY(-50%)" }}
                        onClick={() => navigate("/events", { state: { eventId: event.event_id } })}
                      >
                        <div className="relative bg-gray-700 rounded-lg p-5 shadow-md hover:bg-gray-600 border border-gray-600 transition-all duration-300">
                          <h4 className="text-2xl font-semibold text-white mb-2">
                            {event.event_name}
                          </h4>
                          <div className="flex flex-wrap gap-3 text-gray-400 text-sm mb-3">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />{" "}
                              {new Date(event.event_start_date).toLocaleDateString()} –{" "}
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
                            <span className="font-mono text-gray-400">{event.event_id}</span>
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
      )}
    </div>
  );
};

export default EventHistory;
