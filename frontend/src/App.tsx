import React, { useState } from 'react';
import { Film, Search, Upload, Settings2 } from 'lucide-react';
import MovieGrid from './components/MovieGrid';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Movie } from './types';
import axios from 'axios';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: 1,
      title: 'Inception',
      release_date: '2010',
      poster_path: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500',
      overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      vote_average: 8.8
    },
    {
      id: 2,
      title: 'The Dark Knight',
      release_date: '2008',
      poster_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=500',
      overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      vote_average: 9.0
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger an API call to search movies
  };

  const [subFolderNames, setSubFolderNames] = useState<string[]>([]);
  const folderPickerRef = useRef<HTMLInputElement>(null);

  const handleScrape = async () => {    try {
    if (folderPickerRef.current) {
      folderPickerRef.current.click();
      folderPickerRef.current.addEventListener('change', async (event) => {
        const target = event.target as HTMLInputElement;
        if (target && target.files && target.files.length > 0) {
          const selectedFolder = target.files[0];
          const subfolders = await getSubFolders(selectedFolder);
          setSubFolderNames(subfolders);
          // 将子文件夹名字数组传递给后端
          await axios.post('localhost:3000/movies/scrape', { subfolders });
        } else {
          console.error('No folder selected.');
        }
      });
    } else {
      console.error('Folder picker element not found.');
    }
  } catch (error) {
    console.error('Error handling scrape:', error);
  }
};

  const getSubFolders = async (folder: File) => {
    const subfolders: string[] = [];

    return subfolders;
  };


  const fetchMovies = async () => {
    try {
        const response = await axios.get('/api/movies/getinfo');
        setMovies(response.data);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
  };

  return (
    <div>
      <button id="scrapeButton" onClick={handleScrape}>Scrape Movies</button>
      <input
        type="file"
        ref={folderPickerRef}
        style={{ display: 'none' }}
      />
      {subFolderNames.length > 0 && (
        <div>
          <h2>Subfolders:</h2>
          <ul>
            {subFolderNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
