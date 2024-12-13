import React from 'react';
import { Film, Home, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="h-full bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
      <div className="mb-8">
        <Film className="w-8 h-8 text-blue-500" />
      </div>
      <div className="flex flex-col space-y-4">
        <Link
          to="/"
          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
        >
          <Home className="w-6 h-6" />
        </Link>
        <Link
          to="/explore"
          className="w-12 h-12 flex items-center justify-center text-gray-700 hover:text-white hover:bg-gray-700 rounded-lg"
        >
          <Compass className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  )
}

export default Sidebar;