import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { PostGateway } from './post.gateway';

@Injectable()
export class PostService {
  constructor(
    private fileService: FileService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly postGateway: PostGateway,
  ) {}

  async create(data: {
    file: Express.Multer.File;
    id: number;
    tags: string[];
  }) {
    const { file, id, tags } = data;
    const fileName = this.fileService.createFile(file, id);
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
    await this.postRepository.save({
      name: fileName,
      mime: file.mimetype,
      tags: tagsArray,
      user: {
        id,
      },
    });
    const post = await this.postRepository.findOne({
      where: {
        name: fileName,
      },
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
    });

    this.postGateway.updatePostList(post);

    return post;
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
