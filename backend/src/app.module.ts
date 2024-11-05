import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'username',
      password: 'password',
      database: 'movie_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 仅开发使用
    }),
    MovieModule,
  ],
})
export class AppModule {}
