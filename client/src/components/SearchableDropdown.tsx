import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchableDropdownProps<T> {
  items: T[];
  selectedItem: T | null;
  onItemSelect: (item: T | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  getItemLabel: (item: T) => string;
  getItemSubLabel?: (item: T) => string;
  filterFunction?: (item: T, searchTerm: string) => boolean;
}

function SearchableDropdown<T>({
  items,
  selectedItem,
  onItemSelect,
  placeholder = "Select item",
  searchPlaceholder = "Search...",
  getItemLabel,
  getItemSubLabel,
  filterFunction
}: SearchableDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    if (filterFunction) return items.filter(item => filterFunction(item, searchTerm));
    return items.filter(item =>
      getItemLabel(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (getItemSubLabel && getItemSubLabel(item).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm, filterFunction, getItemLabel, getItemSubLabel]);

  // Handle selection
  const handleItemSelect = (item: T) => {
    onItemSelect(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[focusedIndex]) handleItemSelect(filteredItems[focusedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Reset focus when items change
  useEffect(() => {
    setFocusedIndex(0);
  }, [searchTerm, isOpen, filteredItems.length]);

  // Scroll focused item into view
  useEffect(() => {
    const ref = itemRefs.current[focusedIndex];
    if (ref) {
      ref.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Dropdown button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 0); // Focus input when opening
        }}
        className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-card"
      >
        <span className={selectedItem ? 'text-white font-semibold' : 'text-gray-400'}>
          {selectedItem ? getItemLabel(selectedItem) : placeholder}
        </span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl z-30 animate-slide-down backdrop-blur-sm">
          {/* Search input */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-semibold"
                autoFocus
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-gray-400 text-center font-medium">No items found</div>
            ) : (
              <div className="py-1">
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    ref={el => itemRefs.current[index] = el}
                    onClick={() => handleItemSelect(item)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full px-4 py-3 text-left transition-all duration-200 border-b border-gray-700 last:border-b-0
                      ${index === focusedIndex ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-white'}
                    `}
                  >
                    <div className="font-bold">{getItemLabel(item)}</div>
                    {getItemSubLabel && <div className="text-sm text-gray-400 mt-1 font-medium">{getItemSubLabel(item)}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
