import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps<T> {
  items: T[];
  selectedItem: T | null;
  onItemSelect: (item: T | null) => void;
  getItemLabel: (item: T) => string;
  placeholder?: string;
  allOptionLabel?: string; // e.g., "All Years" or "All Regions"
}

function Dropdown<T>({
  items,
  selectedItem,
  onItemSelect,
  getItemLabel,
  placeholder = "Select",
  allOptionLabel = "All",
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: T | null) => {
    onItemSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-val-red-500 shadow-card"
      >
        <span className={selectedItem ? "text-white font-semibold" : "text-gray-400"}>
          {selectedItem ? getItemLabel(selectedItem) : placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-val-red-400" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto animate-slide-down backdrop-blur-sm">
          <div className="py-1">
            <button
              onClick={() => handleSelect(null)}
              className="w-full px-4 py-3 text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200 font-semibold border-b border-gray-700"
            >
              {allOptionLabel}
            </button>
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 hover:text-val-red-400 transition-all duration-200"
              >
                <span className="font-semibold">{getItemLabel(item)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
