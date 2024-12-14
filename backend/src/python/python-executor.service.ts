import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class PythonExecutorService {
  async runPythonScript(scriptPath: string, args: string): Promise<string> {
    try {
      const { stdout, stderr } = await execPromise(`python ${scriptPath} ${args}`);
      if (stderr) {
        throw new Error(`Error: ${stderr}`);
      }
      return stdout;
    } catch (error) {
      throw new Error(`Failed to run Python script: ${error.message}`);
    }
  }
}
