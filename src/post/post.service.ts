import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';

@Injectable()
export class PostService {
  constructor(
    private fileService: FileService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(file: Express.Multer.File, id: number) {
    const name = this.fileService.createFile(file, id);
    const post = await this.postRepository.save({
      name,
      mime: file.mimetype,
      user: {
        id,
      },
    });
    return post;
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return posts.map((post) => ({
      id: post.id,
      name: post.name,
      createDate: post.createdAt,
      userName: post.user.name,
      userId: post.user.id,
    }));
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }
  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
