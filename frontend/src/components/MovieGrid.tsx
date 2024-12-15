import React from 'react';
import { Star } from 'lucide-react';
import { Movie, Show } from '../types';

interface MovieGridProps {
  movies: (Movie | Show)[];
}

const MovieGrid = ({ movies }: MovieGridProps) => {
  // Type guard to check if an item is of type ShowProp
  const isMovie = (item: Movie | Show): item is Movie => {
    return 'title' in item;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="relative aspect-[2/3]">
            <img
              src={movie.poster_path}
              alt={isMovie(movie) ? movie.title : (movie as Show).name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm">{movie.vote_average}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold truncate">{isMovie(movie) ? movie.title : (movie as Show).name}</h3>
            <p className="text-gray-400 text-sm mb-2">{isMovie(movie) ? movie.release_date: (movie as Show).first_air_date}</p>
            <p className="text-gray-300 text-sm line-clamp-2">{movie.overview}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
