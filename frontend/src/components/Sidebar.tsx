import React from 'react';
import { Film, RefreshCcw } from 'lucide-react';

interface SidebarProps {
  onRefresh: () => void;
}

const Sidebar = ({ onRefresh }: SidebarProps) => {
  return (
    <aside className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
      <div className="mb-8">
        <Film className="w-8 h-8 text-blue-500" />
      </div>
      <nav className="flex-1">
        <button 
          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg mb-2"
          onClick={onRefresh}
        >
          <RefreshCcw className="w-6 h-6" />
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;