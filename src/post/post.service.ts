import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
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
    const name = this.fileService.createFile(file);
    const post = await this.postRepository.save({
      name,
      user: {
        id,
      },
    });
    return post;
  }
  // findAll() {
  //   return `This action returns all post`;
  // }
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
