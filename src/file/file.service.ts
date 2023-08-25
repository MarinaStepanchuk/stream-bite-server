import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { createReadStream } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  createFile(file: Express.Multer.File, userId: number) {
    try {
      const fileExtension = file.mimetype.split('/').at(-1);
      const fileName = uuid.v4() + '.' + fileExtension;
      const userFolderPath = path.resolve(
        __dirname,
        '..',
        'static',
        `${userId}`,
      );
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
      }
      fs.writeFile(
        path.resolve(userFolderPath, fileName),
        file.buffer,
        (error) => {
          if (error) {
            throw new HttpException(
              error.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        },
      );
      return fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFile(userId: string, name: string) {
    const stream = createReadStream(
      path.resolve(__dirname, '..', 'static', userId, name),
    );

    const mimeType = await this.postRepository.findOne({
      where: {
        name,
        user: {
          id: +userId,
        },
      },
    });

    return {
      stream,
      mimeType,
    };
  }

  removeFile() {}
}
