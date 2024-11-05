import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])], // 导入 TypeORM 模块并注册实体
  providers: [MovieService], // 注册服务
  controllers: [MovieController], // 注册控制器
})
export class MovieModule {}
