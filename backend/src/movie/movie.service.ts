import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import axios from 'axios';
import * as path from 'path';
import { writeFile, readFile, unlink } from 'fs/promises';
import FormData = require('form-data');

@Injectable()
export class MovieService {
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = '144d2fc5c93a529e8c1e53ce234f2480';
  private readonly nginxServer = '43.143.98.164';

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
        const { id, title, release_date, poster_path, overview, vote_average } = movieData;
        console.log(`Id for the movie ${title} is ${id}.`);

        // 下载海报图片到本地并上传到nginx文件服务器
        if (poster_path) {
          const imageName = poster_path.substring(1);

          const posterUrl = `https://image.tmdb.org/t/p/original${poster_path}`;
          const imageResponse = await axios.get(posterUrl, { responseType: 'arraybuffer' });

          const tempImagePath = path.join(__dirname, '../../.tmp', imageName);

          await writeFile(tempImagePath, imageResponse.data);
          console.log(`Downloaded poster for movie: ${title} to temporary path ${tempImagePath}`);

          const nginxUploadUrl = `http://${this.nginxServer}/upload/?folder=movie_db/img_poster`;
          const formData = new FormData();
          formData.append('file', await readFile(tempImagePath), imageName);

          const uploadResponse = await axios.post(nginxUploadUrl, formData, {
            headers: formData.getHeaders(),
          });

          if (uploadResponse.status === 200) {
            console.log(`Uploaded poster for movie: ${title} to Nginx server`);

            const nginxImagePath = `http://${this.nginxServer}/download/movie_db/img_poster/${imageName}`;

            const newMovie = this.movieRepository.create({
              id,
              title,
              release_date,
              poster_path: nginxImagePath,
              overview,
              vote_average,
            });

            await this.movieRepository.save(newMovie);
            console.log(`Saved movie: ${title}`);
          } else {
            console.error(`Failed to upload image to Nginx for movie: ${title}`);
          }

          // 删掉.tmp的图片
          await unlink(tempImagePath);
        } else {
          console.log(`No poster found for movie: ${title}`);
        }
      } else {
        console.log(`No data found for movie: ${localMovieName}`);
      }
    } catch (error) {
      console.error('Error fetching data from TMDB:', error);
    }
  }
}