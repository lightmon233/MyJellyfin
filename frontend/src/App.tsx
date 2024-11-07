import React, { useState } from 'react';
import { Film, Search, Upload, Settings2 } from 'lucide-react';
import MovieGrid from './components/MovieGrid';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Movie } from './types';

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

  const handleScrape = () => {
    // In a real app, this would trigger the movie scraping process
    alert('Scraping functionality would be implemented here');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} onScrape={handleScrape} />
        <main className="flex-1 overflow-y-auto p-6">
          <MovieGrid movies={movies} />
        </main>
      </div>
    </div>
  );
};

export default App;
