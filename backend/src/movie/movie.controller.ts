import { Controller, Get, Query, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('scrape')
  async scrapeMovie(
    @Query('names') names: string,
    @Query('primary_release_year') primaryReleaseYear?: string,
    @Query('language') language?: string
  ): Promise<string> {
    const nameArray = names.split(',,');
    for (const name of nameArray) {
      await this.movieService.scrapeMovieData(name, primaryReleaseYear, language);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return `Movie data for [${nameArray.join(', ')}] has been scraped and stored.`;
  }

  @Get('getinfo')
  async getMoviesInfo(): Promise<Movie[]> {
    try {
      return this.movieService.getAllMovies();
    } catch (error) {
      console.error('Error fetching movie_db:', error);
      return [];
    }
  }

  @Delete('deleteAll')
  async deleteAllMovies(): Promise<string> {
    try {
      await this.movieService.deleteAllMovies();
      return 'All movie data has been deleted.';
    } catch (error) {
      console.error('Error deleting movie data:', error);
      return 'Failed to delete movie data.';
    }
  }
}
