import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FileService {
  createFile(file: Express.Multer.File) {
    try {
      const fileExtension = file.originalname.split('.').at(-1);
      const fileName = uuid.v4() + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'static', fileName);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFile(path.resolve(filePath, fileName), file.buffer, (error) => {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
      return fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile() {}
}
