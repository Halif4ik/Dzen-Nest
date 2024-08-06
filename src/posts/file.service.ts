import * as path from 'path';
import {ensureDir, writeFile} from 'fs-extra';

export class FileElementResponse {
   url: string;
   name: string;
}

export class FileService {
   async createFile(files: Express.Multer.File): Promise<FileElementResponse | null> {
      const filePath: string = path.join(__dirname, '../../public/upload');
      await ensureDir(filePath);
      const fileName: string = `${Date.now()}-${files.originalname}`;
      await writeFile(path.join(filePath, fileName), files.buffer);
      return ({url: `${filePath}/${fileName}`, name: fileName});
   }
}