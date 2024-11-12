import React, { useRef, useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onScrape: ({
    names, primary_release_year, language
  }: {
    names: string[]; primary_release_year?: string; language?: string
  }) => void;
  onFilter: (query: string) => void;
}

const Header = ({ onSearch, onScrape, onFilter }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchButton = () => {
    onSearch(searchQuery);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 点击按钮时触发文件选择框
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 触发文件选择
    }
  }

  // 处理文件夹选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const folderSet = new Set<string>();

    // 获取每个文件的相对路径并提取第一层子文件夹名称
    Array.from(files).forEach((file) => {
      const path = file.webkitRelativePath;
      const folderName = path.split('/')[1]; // 获取文件夹名称
      folderSet.add(folderName); // 将文件夹名称添加到集合中
    });

    onScrape({names: Array.from(folderSet)});
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
              onClick={handleSearchButton} 
            />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchButton()}
            />
          </div>
        </div>
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter movies..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              onChange={(e) => onFilter(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleButtonClick}
          className="ml-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 text-white"
        >
          Scrape Directory
        </button>
        {/*因为react的bug，用ts写webkitdirectory要加上下面这个指令*/}
        {/* @ts-expect-error */}
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} webkitdirectory="" onChange={handleFileChange}/>
      </div>
    </header>
  );
};

export default Header;
