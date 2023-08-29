import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class PostService {
  constructor(
    private fileService: FileService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(data: {
    file: Express.Multer.File;
    id: number;
    tags: string[];
  }) {
    const { file, id, tags } = data;
    const name = this.fileService.createFile(file, id);
    const tagsArray = await Promise.all(
      tags.map(async (tag) => {
        const existingTag = await this.tagRepository.findOne({
          where: { text: tag },
        });
        if (existingTag) {
          return existingTag;
        }

        return await this.tagRepository.save({ text: tag });
      }),
    );
    console.log(tagsArray);
    const newPost = await this.postRepository.save({
      name,
      mime: file.mimetype,
      tags: tagsArray,
      user: {
        id,
      },
    });
    return newPost;
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: {
        user: true,
        tags: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const a = posts.map((post) => ({
      id: post.id,
      name: post.name,
      createDate: post.createdAt,
      userName: post.user.name,
      userId: post.user.id,
      tags: post.tags,
    }));
    console.log(a);

    return a;
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
