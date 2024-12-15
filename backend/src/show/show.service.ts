import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Show } from './show.entity';
import axios from 'axios';
import * as path from 'path';
import { writeFile, readFile, unlink } from 'fs/promises';
import FormData = require('form-data');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShowService {
  private readonly configService = new ConfigService();
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = this.configService.get<string>('TMDB_API_KEY');
  private readonly nginxServer = this.configService.get<string>('NGINX_HOST');

  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    private readonly dataSource: DataSource
  ) {}

  async deleteDatabase(): Promise<void> {
    try {
      // This will drop the database
      await this.dataSource.dropDatabase();
      console.log('Database deleted successsfully');
    } catch (error) {
      console.error('Error deleting the database:', error);
      throw new Error('Failed to delete database');
    }
  }

  async deleteAllShows(): Promise<void> {
    try {
      await this.showRepository.clear();
      console.log('All shows have been deleted');
    } catch (error) {
      console.error('Error deleting shows from the database:', error);
      throw new Error('Failed to delete shows');
    }
  }

  async scrapeShowData(
    localShowName: string,
    firstAirDateYear?: string,
    language?: string
  ): Promise<void> {
    try {
      const params: {
        api_key: string,
        query: string,
        first_air_date_year?: string,
        language?: string
      } = { api_key: this.apiKey, query: localShowName };

      if (firstAirDateYear) {
        params.first_air_date_year = firstAirDateYear;
      }
      if (language) {
        params.language = language;
      }

      const response = await axios.get(
        `${this.tmdbBaseUrl}/search/tv`,
        {
          params
        },
      );

      const showData = response.data.results[0];
      if (showData) {
        const { id, name, first_air_date, poster_path, overview, vote_average, original_name } = showData;
        console.log(`Id for the show ${name} is ${id}.`);

        // 下载海报图片到本地并上传到nginx文件服务器
        if (poster_path) {
          const imageName = poster_path.substring(1);

          const posterUrl = `https://image.tmdb.org/t/p/w500/${poster_path}`;
          const imageResponse = await axios.get(posterUrl, { responseType: 'arraybuffer' });

          const tempImagePath = path.join(__dirname, '../../.tmp', imageName);

          await writeFile(tempImagePath, imageResponse.data);
          console.log(`Downloaded poster for show: ${name} to temporary path ${tempImagePath}`);

          const nginxUploadUrl = `http://${this.nginxServer}/upload/?folder=movie_db/img_poster`;
          const formData = new FormData();
          formData.append('file', await readFile(tempImagePath), imageName);

          const uploadResponse = await axios.post(nginxUploadUrl, formData, {
            headers: formData.getHeaders(),
          });

          if (uploadResponse.status === 200) {
            console.log(`Uploaded poster for show: ${name} to Nginx server`);

            const nginxImagePath = `http://${this.nginxServer}/download/movie_db/img_poster/${imageName}`;

            const newShow = this.showRepository.create({
              id,
              name,
              first_air_date,
              poster_path: nginxImagePath,
              overview,
              vote_average,
							original_name
            });

            await this.showRepository.save(newShow);
            console.log(`Saved show: ${name}`);
          } else {
            console.error(`Failed to upload image to Nginx for show: ${name}`);
          }

          // 删掉.tmp的图片
          await unlink(tempImagePath);
        } else {
          console.log(`No poster found for show: ${name}`);
        }
      } else {
        console.log(`No data found for movie: ${localShowName}`);
      }
    } catch (error) {
      console.error('Error fetching data from TMDB:', error);
    }
  }

  async getAllShows(): Promise<Show[]> {
    try {
      const shows = await this.showRepository.find();
      return shows;
    } catch (error) {
      console.error('Error fetching shows from the database:', error);
      throw new Error('Failed to fetch shows');
    }
  }
  
}