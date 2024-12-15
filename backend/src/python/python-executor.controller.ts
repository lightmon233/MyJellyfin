import { Controller, Get, Query } from '@nestjs/common';
import { PythonExecutorService } from './python-executor.service';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonExecutorService: PythonExecutorService) {}

  @Get('run')
  async runPythonScript(@Query('path') path: string, @Query('args') args: string): Promise<string> {
    return this.pythonExecutorService.runPythonScript(path, args);
  }
}
