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
      select: {
        id: true,
        name: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        tags: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return posts;
  }

  async findAllUserPosts(userId: number) {
    const [posts, count] = await this.postRepository.findAndCount({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user', 'tags'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
        tags: true,
        id: true,
        name: true,
        createdAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return { posts, count };
  }
}
