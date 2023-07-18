import { promises as fs } from 'fs';

export async function readLinesFromFile(filePath: string): Promise<string[]> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const lines = fileContent.split('\n').map((line: string) => line.trim());
  return lines.filter((line: string) => line !== '');
}
