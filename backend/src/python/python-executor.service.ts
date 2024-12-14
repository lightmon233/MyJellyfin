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
      const result = JSON.parse(stdout);
      result.recommendations.forEach((recommendation: any) => {
        if (recommendation.poster_path) {
          recommendation.poster_path = `https://image.tmdb.org/t/p/w500${recommendation.poster_path}`;
        }
      });
      return JSON.stringify(result, null, 4);
    } catch (error) {
      throw new Error(`Failed to run Python script: ${error.message}`);
    }
  }
}
