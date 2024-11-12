import React, { useState } from 'react';
import { Film, Search, Upload, Settings2 } from 'lucide-react';
import MovieGrid from './components/MovieGrid';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Movie } from './types';
import axios from 'axios';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([

  ]);

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

    // 总结：如果filter自己后在赋给自己的话就会出问题，问题就是减字符的时候页面会保持不变
    // 应该是因为这样操作的话，自己就真的被filter了，每次filter都会是自己的集合缩小，
    // 所以即时再减字符也不能使得集合再变大

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

  const handleSearch = async (query: string) => {
    handleScrape([query]);
  }

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
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    } finally {
      // 把callback放在finally块中，可以确保在try-catch执行后，无论是否发生异常都调用callback
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar onRefresh={fetchMovies}/>
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
