import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '43.143.98.164',
      port: 5432,
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
