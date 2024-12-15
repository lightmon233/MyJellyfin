import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './show.entity';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Show])], // 导入 TypeORM 模块并注册实体
  providers: [ShowService], // 注册服务
  controllers: [ShowController], // 注册控制器
})
export class ShowModule {}
