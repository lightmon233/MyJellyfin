import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使读取环境变量的配置模块在整个应用中可用
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 仅开发使用
        logging: true, // 启用SQL日志
      }),
      inject: [ConfigService],
    }),
    MovieModule,
  ],
})
export class AppModule {}
