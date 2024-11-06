import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import axios from 'axios';

@Injectable()
export class MovieService {
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = 'REMOVED';

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async scrapeMovieData(localMovieName: string): Promise<void> {
    try {
      const response = await axios.get(
        `${this.tmdbBaseUrl}/search/movie`,
        {
          params: {
            api_key: this.apiKey,
            query: localMovieName,
          },
        },
      );

      const movieData = response.data.results[0];
      if (movieData) {
        const newMovie = this.movieRepository.create({
          id: movieData.id,
          title: movieData.title,
          release_date: movieData.release_date,
          poster_path: movieData.poster_path,
          overview: movieData.overview,
          vote_average: movieData.vote_average
        });
        await this.movieRepository.save(newMovie);
        console.log(`Saved movie: ${movieData.title}`);
      } else {
        console.log(`No data found for movie: ${localMovieName}`);
      }
    } catch (error) {
      console.error('Error fetching data from TMDB:', error);
    }
  }
}