import React, { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";
import type { Config, Data, Layout, PlotMouseEvent } from "plotly.js";

interface PlotlyChartProps {
  data: Data[];
  layout?: Partial<Layout>;
  className?: string;
  height?: number;
  onClick?: (event: PlotMouseEvent) => void;
  allowFullScreen?: boolean;
  fullScreenLabel?: string;
  title?: string;
}

const baseLayout: Partial<Layout> = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { color: "#E5E7EB" },
  xaxis: {
    color: "#9CA3AF",
    gridcolor: "#374151",
    zerolinecolor: "#374151",
  },
  yaxis: {
    color: "#9CA3AF",
    gridcolor: "#374151",
    zerolinecolor: "#374151",
  },
  margin: { l: 48, r: 24, t: 20, b: 48 },
  legend: { orientation: "h", y: -0.2, x: 0 },
};

const baseConfig: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
};

const PlotlyChart: React.FC<PlotlyChartProps> = ({
  data,
  layout,
  className,
  height = 280,
  onClick,
  allowFullScreen = true,
  fullScreenLabel = "Full screen",
  title,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenHeight, setFullScreenHeight] = useState(height);

  useEffect(() => {
    if (!isFullScreen) return;

    const updateHeight = () => {
      const nextHeight = Math.max(360, window.innerHeight - 160);
      setFullScreenHeight(nextHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", updateHeight);
      document.body.style.overflow = "";
    };
  }, [isFullScreen]);

  const buildLayout = (customHeight: number) => ({
    ...baseLayout,
    ...layout,
    xaxis: { ...(baseLayout.xaxis ?? {}), ...(layout?.xaxis ?? {}) },
    yaxis: { ...(baseLayout.yaxis ?? {}), ...(layout?.yaxis ?? {}) },
    margin: { ...(baseLayout.margin ?? {}), ...(layout?.margin ?? {}) },
    legend: { ...(baseLayout.legend ?? {}), ...(layout?.legend ?? {}) },
    height: customHeight,
    autosize: true,
  });

  const resolvedHeight = layout?.height ?? height;
  const mergedLayout = useMemo(
    () => buildLayout(resolvedHeight),
    [layout, resolvedHeight]
  );

  return (
    <div className={className}>
      <div className="relative">
        {allowFullScreen && (
          <button
            type="button"
            className="absolute right-2 top-2 z-10 rounded-lg border border-gray-600 bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 hover:shadow-lg"
            onClick={() => setIsFullScreen(true)}
          >
            {fullScreenLabel}
          </button>
        )}
        <Plot
          data={data}
          layout={mergedLayout}
          config={baseConfig}
          useResizeHandler
          style={{ width: "100%", height: `${resolvedHeight}px` }}
          onClick={onClick}
        />
      </div>

      {allowFullScreen && isFullScreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/98 backdrop-blur-md animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-gray-900/80 backdrop-blur-sm">
            <span className="text-lg font-bold text-white">
              {title ?? "Expanded chart"}
            </span>
            <button
              type="button"
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300"
              onClick={() => setIsFullScreen(false)}
            >
              Close
            </button>
          </div>
          <div className="flex-1 px-6 py-4">
            <Plot
              data={data}
              layout={buildLayout(fullScreenHeight)}
              config={baseConfig}
              useResizeHandler
              style={{ width: "100%", height: `${fullScreenHeight}px` }}
              onClick={onClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlotlyChart;
