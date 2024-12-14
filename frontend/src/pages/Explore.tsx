import React, { useEffect, useState }from 'react';
import { Movie } from '../types';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';

const Explore = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [title, setTitle] = useState<string>();

	const fetchRecommendedMovies = async () => {
		try {
			const scraped_movies = await axios.get('/api/movies/getinfo');
			const ids = scraped_movies.data.map((item: Movie) => item.id);
			const index = Math.floor(Math.random() * ids.length);
			const chosen_id = ids[index];
			const response = await axios.get('/api/python/run', {
				params: {
					args: chosen_id
				}
			});
			const recommendations = response.data.recommendations;
			setMovies(recommendations);
			const title = scraped_movies.data[index].title;
			setTitle(title);
		} catch (error) {
			console.error('Error fetching movies:', error);
			return [];
		}
	};

	useEffect(() => {
		fetchRecommendedMovies();
	}, []);

	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			<div className="bg-gray-800 border-b border-gray-700 p-4">
				<h1 className="text-2xl font-semibold text-white text-center">
					{`Because you've scrapped ${title}:`}
				</h1>
			</div>
			<main className="flex-1 overflow-y-auto p-6">
				<MovieGrid movies={movies} />
			</main>
		</div>
	);
}

export default Explore;