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

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);

  const handleFilter = (query: string) => {
    // setFilteredMovies(movies);
    // if (query.trim() != '') {
    //   const filtered = filteredMovies.filter(movie =>
    //     movie.title.toLowerCase().includes(query.toLowerCase())
    //   );
    //   setFilteredMovies(filtered);
    // }
    // 以上代码有bug是因为 filteredMovies 的状态更新是异步的。
    // 在调用 setFilteredMovies 后，状态不会立即更新，
    // 而是会等到下一个渲染周期才生效。因此，console.log(filteredMovies) 
    // 打印出来的值还是之前的状态，而不是刚刚更新后的值。
    if (query.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
    console.log(movies);
    console.log(filteredMovies);
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger an API call to search movies
  };

  const handleScrape = async (folders: string[]) => {    
    try {
      const folderString = folders.join(',,');
      console.log(folderString);
      const response = await axios.get('/api/movies/scrape', {
        params: {
          names: folderString
        },
        timeout: 60000
      });
      console.log("reponse:", response);
      console.log("folder's names sent to backend:", folders);
      fetchMovies();
    } catch (error) {
      console.error("error when sending folders' names:", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies/getinfo');
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} onScrape={handleScrape} onFilter={handleFilter}/>
        <main className="flex-1 overflow-y-auto p-6">
          <MovieGrid movies={filteredMovies} />
        </main>
      </div>
    </div>
  );
};

export default App;
