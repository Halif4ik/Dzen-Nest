import * as path from 'path';
import {ensureDir, writeFile} from 'fs-extra';
import {HttpException, HttpStatus} from '@nestjs/common';

export class FileElementResponse {
   url: string;
   name: string;
}

export class FileService {
   async createFile(files: Express.Multer.File[]): Promise<FileElementResponse | null> {
      try {
         const filePath: string = path.join(__dirname, '../../public/upload');
         const temp = await ensureDir(filePath);
         let resp: FileElementResponse | null = null;
         if (files) {
            const fileName: string = `${Date.now()}-${files[0].originalname}`;
            await writeFile(path.join(filePath, fileName), files[0].buffer);
            resp = ({url: `${filePath}/${fileName}`, name: fileName});
         }
         return resp;
      } catch (e) {
         throw new HttpException('Error write file on disk', HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}