import Sidebar from './components/Sidebar';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Movies from './pages/Movies';
import Explore from './pages/Explore';
import Shows from './pages/Shows';

const App = () => {
  // const handleDelete = async () => {
  //   try {
  //     const response = await axios.delete('/api/movies/deleteAll');
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error deleting movie data:', error);
  //   }
  //   fetchMovies();
  // }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex">
        <Routes>
          <Route path="/" element={<Movies />}></Route>
          <Route path="/shows" element={<Shows />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
