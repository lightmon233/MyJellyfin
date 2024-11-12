import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('scrape_single')
  async scrapeMovieSingle(@Query('name') name: string): Promise<string> {
    this.movieService.scrapeMovieData(name);
    return `Movie data for ${name} has been scraped.`;
  }

  @Get('scrape')
  async scrapeMovie(@Query('names') names: string): Promise<string> {
    const nameArray = names.split(',,');
    for (const name of nameArray) {
      await this.movieService.scrapeMovieData(name);
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
}
