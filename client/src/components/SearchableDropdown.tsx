import React, { useState, useMemo } from 'react';
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

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    
    if (filterFunction) {
      return items.filter(item => filterFunction(item, searchTerm));
    }
    
    return items.filter(item =>
      getItemLabel(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (getItemSubLabel && getItemSubLabel(item).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm, filterFunction, getItemLabel, getItemSubLabel]);

  const handleItemSelect = (item: T) => {
    onItemSelect(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selectedItem ? 'text-white' : 'text-gray-400'}>
          {selectedItem ? getItemLabel(selectedItem) : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-30">
          <div className="p-3 border-b border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-gray-600 border border-gray-500 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-center">
                No items found
              </div>
            ) : (
              <div className="py-1">
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleItemSelect(item)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors border-b border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-white">{getItemLabel(item)}</div>
                    {getItemSubLabel && (
                      <div className="text-sm text-gray-400 mt-1">{getItemSubLabel(item)}</div>
                    )}
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