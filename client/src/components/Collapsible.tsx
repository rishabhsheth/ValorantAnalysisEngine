import { useState, ReactNode, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<string>("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  return (
    <div className={`rounded-xl overflow-hidden border border-gray-700 ${className}`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-700 hover:bg-gray-600 transition"
      >
        <span className="text-lg font-semibold text-white">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-300" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-300" />
        )}
      </button>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          transition: "max-height 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div className="p-6 bg-gray-800">{children}</div>
      </div>
    </div>
  );
};

export default Collapsible;
