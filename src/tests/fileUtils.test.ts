import { readLinesFromFile } from '../utils/fileUtils'; // Update the import path accordingly
import { promises as fs } from 'fs';

describe('readLinesFromFile', () => {
  test('should read lines from a file and return an array of strings', async () => {
    const filePath = 'test-file.txt'; // Dummy file for this test

    // Create a temporary test file with known content
    const fileContent = 'Line 1\n   \nLine 2  \nLine 3\n';
    await fs.writeFile(filePath, fileContent, 'utf-8');

    const expectedLines = ['Line 1', 'Line 2', 'Line 3'];
    const lines = await readLinesFromFile(filePath);

    expect(lines).toEqual(expectedLines);
  });

  test('should handle an empty file', async () => {
    const filePath = 'empty-test-file.txt'; // Dummy file for this test

    // Create a temporary empty test file
    await fs.writeFile(filePath, '', 'utf-8');

    const lines = await readLinesFromFile(filePath);

    expect(lines).toEqual([]);
  });

  test('should handle a file with only empty lines', async () => {
    const filePath = 'empty-lines-test-file.txt'; // Dummy file for this test

    // Create a temporary test file with only empty lines
    const fileContent = '\n   \n\n  \n';
    await fs.writeFile(filePath, fileContent, 'utf-8');

    const lines = await readLinesFromFile(filePath);

    expect(lines).toEqual([]);
  });

 });
