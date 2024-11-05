import React from 'react';
import { Search, Upload } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onScrape: () => void;
}

const Header = ({ onSearch, onScrape }: HeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={onScrape}
          className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transition-colors"
        >
          <Upload size={20} className="mr-2" />
          Scrape Movies
        </button>
      </div>
    </header>
  );
};

export default Header;