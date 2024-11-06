import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '206.237.19.214',
      port: 2289,
      username: 'postgres',
      password: 'postgres',
      database: 'movie_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 仅开发使用
    }),
    MovieModule,
  ],
})
export class AppModule {}
