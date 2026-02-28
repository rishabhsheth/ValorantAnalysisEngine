// react core bits
import React, { useEffect, useMemo, useState } from "react";
// render outside tree
import { createPortal } from "react-dom";
// close icon
import { X } from "lucide-react";
// plotly types
import type { Config, Data, Layout, PlotMouseEvent } from "plotly.js";

// lazy plot import
const Plot = React.lazy(() => import("react-plotly.js"));

// component props
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

// shared plot layout
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

// plotly config defaults
const baseConfig: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
};

// main chart component
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
  // modal toggle state
  const [isFullScreen, setIsFullScreen] = useState(false);

  // lock body scroll
  useEffect(() => {
    if (!isFullScreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullScreen]);

  // merge layout defaults
  const buildLayout = (customLayout?: Partial<Layout>, customHeight?: number) => {
    const nextLayout: Partial<Layout> = {
      ...baseLayout,
      ...customLayout,
      xaxis: { ...(baseLayout.xaxis ?? {}), ...(customLayout?.xaxis ?? {}) },
      yaxis: { ...(baseLayout.yaxis ?? {}), ...(customLayout?.yaxis ?? {}) },
      margin: { ...(baseLayout.margin ?? {}), ...(customLayout?.margin ?? {}) },
      legend: { ...(baseLayout.legend ?? {}), ...(customLayout?.legend ?? {}) },
      autosize: true,
    };

    if (customHeight !== undefined) {
      nextLayout.height = customHeight;
    } else {
      // allow autosize height
      delete nextLayout.height;
    }

    return nextLayout;
  };

  // resolved chart height
  const resolvedHeight = layout?.height ?? height;
  // memoized inline layout
  const mergedLayout = useMemo(
    () => buildLayout(layout, resolvedHeight),
    [layout, resolvedHeight]
  );
  // memoized modal layout
  const modalLayout = useMemo(() => buildLayout(layout), [layout]);
  // inline fallback
  const inlineFallback = (
    <div
      className="flex w-full items-center justify-center text-sm text-gray-400"
      style={{ height: `${resolvedHeight}px` }}
    >
      Loading chart...
    </div>
  );
  // modal fallback
  const modalFallback = (
    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
      Loading chart...
    </div>
  );
  // open modal button
  const openButton = allowFullScreen ? (
    <button
      type="button"
      className="absolute right-2 top-2 z-10 rounded-lg border border-gray-600 bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 hover:shadow-lg"
      onClick={() => setIsFullScreen(true)}
    >
      {fullScreenLabel}
    </button>
  ) : null;
  // inline chart
  const inlineChart = (
    <React.Suspense fallback={inlineFallback}>
      <Plot
        data={data}
        layout={mergedLayout}
        config={baseConfig}
        useResizeHandler
        style={{ width: "100%", height: `${resolvedHeight}px` }}
        onClick={onClick}
      />
    </React.Suspense>
  );
  // modal chart
  const modalChart = (
    <React.Suspense fallback={modalFallback}>
      <Plot
        data={data}
        layout={modalLayout}
        config={baseConfig}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        onClick={onClick}
      />
    </React.Suspense>
  );
  // modal portal
  const modalPortal =
    allowFullScreen && isFullScreen
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950/80 backdrop-blur-md px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Expanded chart"}
          >
            <div className="flex h-[80vh] max-h-[760px] w-[92vw] max-w-[1200px] flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-gray-900/80 backdrop-blur-sm">
                <span className="text-lg font-bold text-white">
                  {title ?? "Expanded chart"}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-gray-700 bg-gray-800 p-2 text-gray-200 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300"
                  onClick={() => setIsFullScreen(false)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 px-6 py-4">
                {modalChart}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className={className}>
      <div className="relative">
        {openButton}
        {inlineChart}
      </div>

      {modalPortal}
    </div>
  );
};

export default PlotlyChart;
