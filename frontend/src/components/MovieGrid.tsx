import React from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../types';

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid = ({ movies }: MovieGridProps) => {
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
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm">{movie.vote_average}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
            <p className="text-gray-400 text-sm mb-2">{movie.release_date}</p>
            <p className="text-gray-300 text-sm line-clamp-2">{movie.overview}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
