import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('scrape')
  async scrapeMovie(@Query('names') names: string): Promise<string> {
    const nameArray = names.split(',,');
    for (const name of nameArray) {
      this.movieService.scrapeMovieData(name);
    }
    return `Movie data for [${nameArray.join(', ')}] has been scraped and stored.`;
  }
  @Get('getinfo')
  async getMoviesInfo(): Promise<Movie[]> {
    return this.movieService.getAllMovies();
  }
}
