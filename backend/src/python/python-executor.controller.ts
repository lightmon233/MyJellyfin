import { Controller, Get, Query } from '@nestjs/common';
import { PythonExecutorService } from './python-executor.service';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonExecutorService: PythonExecutorService) {}

  @Get('run')
  async runPythonScript(@Query('args') args: string): Promise<string> {
    const scriptPath = 'scripts/content_based.py';
    return this.pythonExecutorService.runPythonScript(scriptPath, args);
  }
}
