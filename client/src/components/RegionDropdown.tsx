import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Region, REGIONS } from '../types';

interface RegionDropdownProps {
  selectedRegion: Region | null;
  onRegionChange: (region: Region | null) => void;
  placeholder?: string;
}

const RegionDropdown: React.FC<RegionDropdownProps> = ({
  selectedRegion,
  onRegionChange,
  placeholder = "Select Region"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRegionSelect = (region: Region) => {
    onRegionChange(region);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <span className={selectedRegion ? 'text-white' : 'text-gray-400'}>
          {selectedRegion ? `${selectedRegion.name} (${selectedRegion.code})` : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
          <div className="py-1">
            <button
              onClick={() => handleRegionSelect(null as any)}
              className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
            >
              All Regions
            </button>
            {REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionSelect(region)}
                className="w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors"
              >
                <span className="font-medium">{region.name}</span>
                <span className="text-gray-400 ml-2">({region.code})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionDropdown;