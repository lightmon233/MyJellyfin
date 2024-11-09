import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('scrape')
  async scrapeMovie(@Query('names') names: string): Promise<string> {
    const nameArray = names.split(',');
    for (const name of nameArray) {
      await this.movieService.scrapeMovieData(name);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return `Movie data for [${nameArray.join(', ')}] has been scraped and stored.`;
  }
}
