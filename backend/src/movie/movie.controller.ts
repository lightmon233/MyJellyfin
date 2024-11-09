import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('scrape')
  async scrapeMovie(@Query('names') names: string[]): Promise<string> {
    for (const name of names) {
      await this.movieService.scrapeMovieData(name);
    }
    return `Movie data for [${names.join(', ')}] has been scraped and stored.`;
  }
}
