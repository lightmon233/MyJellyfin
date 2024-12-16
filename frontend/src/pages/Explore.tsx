import React, { useEffect, useState }from 'react';
import { Movie, Show } from '../types';
import axios from 'axios';
import MovieGrid from '../components/MovieGrid';
import { getBangumiSubjectId, getAnimeNameBySubjectId } from '../utils/bangumi';

const Explore = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [shows, setShows] = useState<Show[]>([]);
	const [title, setTitle] = useState<string>();

	const fetchRecommendedMovies = async () => {
		try {
			const scraped_movies = await axios.get('/api/movies/getinfo');
			const ids = scraped_movies.data.map((item: Movie) => item.id);
			const index = Math.floor(Math.random() * ids.length);
			const chosen_id = ids[index];
			const response = await axios.get('/api/python/run', {
				params: {
					path: "scripts/content_based.py",
					args: chosen_id
				}
			});
			const recommendations = response.data.recommendations;
			// console.log(recommendations);
			setMovies(recommendations);
			const title = scraped_movies.data[index].title;
			setTitle(title);
		} catch (error) {
			console.error('Error fetching movies:', error);
			return [];
		}
	};

	const fetchRecommenededShows = async () => {
		try {
			const scraped_shows = await axios.get('/api/shows/getinfo');
			console.log(scraped_shows.data)
			const ids = await Promise.all(
				scraped_shows.data.map(async (item: Show) => {
					await new Promise(resolve => setTimeout(resolve, 100));
					return await getBangumiSubjectId(item.name);
				})
			);			
			console.log("ids:", ids)
			const response = await axios.get('/api/python/run', {
				params: {
					path: "scripts/user_based.py",
					// url不会过滤掉参数中的'或"
					// 最外面两个"是用来让shell不要把参数中的空格作为参数分隔符
					// 中间插入\"是为了防止shell错将""错误匹配
					args: `"${JSON.stringify(ids).replace(/"/g, '\\"')}"`
				}
			});
			let recommendations = response.data.recommendations;
			recommendations = await Promise.all(
				recommendations.map(async (item: string) => {
					await new Promise(resolve => setTimeout(resolve, 100));
					return await getAnimeNameBySubjectId(item)
				})
			);
			console.log(recommendations);
			recommendations = await Promise.all(
				recommendations.map(async (item: string) => {
					await new Promise(resolve => setTimeout(resolve, 100));
					const response = await axios.get('api/shows/search', {
						params: {
							names: item,
						}
					});
					return response.data;
				})
			);
			const filteredRecommendations = recommendations.filter((item: any) => item);
			setShows(filteredRecommendations);
		} catch (error) {
			console.error('Error fetching shows:', error);
		}
	}

	useEffect(() => {
		fetchRecommendedMovies();
		fetchRecommenededShows();
	}, []);

	return (
		<div className="flex">
			{/* <div className="flex-1 flex flex-col overflow-hidden">
				<div className="bg-gray-800 border-b border-gray-700 p-4">
					<h1 className="text-2xl font-semibold text-white text-center">
						{`Because you've scrapped ${title}:`}
					</h1>
				</div>
				<main className="flex-1 overflow-y-auto p-6">
					<MovieGrid movies={movies} />
				</main>
			</div> */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<div className="bg-gray-800 border-b border-gray-700 p-4">
					<h1 className="text-2xl font-semibold text-white text-center">
						{`Liked by users like you:`}
					</h1>
				</div>
				<main className="flex-1 overflow-y-auto p-6">
					<MovieGrid movies={shows} />
				</main>
			</div>
		</div>
	);
}

export default Explore;