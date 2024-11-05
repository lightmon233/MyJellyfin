import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('scrape')
  async scrapeMovie(@Query('name') name: string): Promise<string> {
    await this.movieService.scrapeMovieData(name);
    return `Movie data for "${name}" has been scraped and stored.`;
  }
}
