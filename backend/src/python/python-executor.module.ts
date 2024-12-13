import { Module } from '@nestjs/common';
import { PythonExecutorService } from './python-executor.service';
import { PythonController } from './python-executor.controller';

@Module({
  providers: [PythonExecutorService],
  exports: [PythonExecutorService],  // 如果你想在其他模块中使用这个服务
  controllers: [PythonController]
})
export class PythonExecutorModule {}
