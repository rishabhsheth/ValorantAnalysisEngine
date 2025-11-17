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
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <span className={selectedItem ? "text-white" : "text-gray-400"}>
          {selectedItem ? getItemLabel(selectedItem) : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
          <div className="py-1">
            <button
              onClick={() => handleSelect(null)}
              className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
            >
              {allOptionLabel}
            </button>
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors"
              >
                <span className="font-medium">{getItemLabel(item)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
