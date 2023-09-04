import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { FileService } from '../file/file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { PostGateway } from './post.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TypeOrmModule.forFeature([Tag])],
  controllers: [PostController],
  providers: [PostService, FileService, PostGateway],
  exports: [PostService],
})
export class PostModule {}
