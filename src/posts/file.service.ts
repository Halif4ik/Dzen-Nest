import * as path from 'path';
import {ensureDir, writeFile} from 'fs-extra';

export class FileElementResponse {
   url: string;
   name: string;
}

export class FileService {
   async createFile(files: Express.Multer.File): Promise<FileElementResponse | null> {
         const filePath: string = path.join(__dirname, '../../public/upload');
         const temp = await ensureDir(filePath);
         let resp: FileElementResponse | null = null;
         if (files) {
            const fileName: string = `${Date.now()}-${files.originalname}`;
            await writeFile(path.join(filePath, fileName), files.buffer);
            resp = ({url: `${filePath}/${fileName}`, name: fileName});
         }
         return resp;
   }
}