import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使读取环境变量的配置模块在整个应用中可用
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: "REMOVED",
        port: REMOVED,
        username: "movie",
        password: "MOVIE@123456",
        database: "movie_db",
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 仅开发使用
      }),
      inject: [ConfigService],
    }),
    MovieModule,
  ],
})
export class AppModule {}
