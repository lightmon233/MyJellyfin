import React from 'react';
import { Film, Home, Compass, Tv } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="h-full bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 px-2">
      <div className="mb-8">
        <Film className="w-8 h-8 text-blue-500" />
      </div>
      <div className="flex flex-col space-y-4">
        <Link
          to="/"
          className={`w-12 h-12 flex items-center justify-center rounded-lg ${
            location.pathname === '/' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Film className="w-6 h-6" />
        </Link>
        <Link
          to="/shows"
          className={`w-12 h-12 flex items-center justify-center rounded-lg ${
            location.pathname === '/shows' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Tv className="w-6 h-6" />
        </Link>
        <Link
          to="/explore"
          className={`w-12 h-12 flex items-center justify-center rounded-lg ${
            location.pathname === '/explore' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Compass className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  )
}

export default Sidebar;