import React from 'react';
import { Film, Settings2 } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
      <div className="mb-8">
        <Film className="w-8 h-8 text-blue-500" />
      </div>
      <nav className="flex-1">
        <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg mb-2">
          <Film className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
          <Settings2 className="w-6 h-6" />
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;