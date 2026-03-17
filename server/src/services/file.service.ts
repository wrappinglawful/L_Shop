import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../database');

export class FileService {
  static async read<T>(fileName: string): Promise<T[]> {
    try {
      const data = await fs.readFile(path.join(DB_PATH, fileName), 'utf-8');
      return JSON.parse(data) as T[];
    } catch (error) {
      return [];
    }
  }

  static async write<T>(fileName: string, data: T[]): Promise<void> {
    await fs.writeFile(path.join(DB_PATH, fileName), JSON.stringify(data, null, 2));
  }
}
