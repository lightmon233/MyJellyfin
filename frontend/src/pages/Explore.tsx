import React, { useEffect }from 'react';
import { Movie } from '../types';
import axios from 'axios';

const Explore = () => {
	const getScrapedMovies = async () => {
    try {
      const response = await axios.get('/api/movies/getinfo');
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  };

	useEffect(() => {
		const response = getScrapedMovies();
		console.log(response);
	}, []);

	return (
		<div>
			Explore
		</div>
	);
}

export default Explore;