import { Controller, Get, Query, Delete } from '@nestjs/common';
import { ShowService } from './show.service';
import { Show } from './show.entity';

@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Get('scrape')
  async scrapeShow(
    @Query('names') names: string,
    @Query('first_air_date_year') firstAirDateYear?: string,
    @Query('language') language?: string
  ): Promise<string> {
    const nameArray = names.split(',,');
    for (const name of nameArray) {
      await this.showService.scrapeShowData(name, firstAirDateYear, language);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return `Show data for [${nameArray.join(', ')}] has been scraped and stored.`;
  }

  @Get('getinfo')
  async getShowsInfo(): Promise<Show[]> {
    try {
      return this.showService.getAllShows();
    } catch (error) {
      console.error('Error fetching movie_db:', error);
      return [];
    }
  }

  @Delete('deleteAll')
  async deleteAllShows(): Promise<string> {
    try {
      await this.showService.deleteAllShows();
      return 'All show data has been deleted.';
    } catch (error) {
      console.error('Error deleting show data:', error);
      return 'Failed to delete show data.';
    }
  }
}
