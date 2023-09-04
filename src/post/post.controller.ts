import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
  Sse,
} from '@nestjs/common';
import { PostService } from './post.service';
// import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, fromEvent, map } from 'rxjs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

interface MessageEvent {
  data: string;
}

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body() body,
  ) {
    const tags = JSON.parse(body.tags);
    const post = await this.postService.create({
      file,
      id: +req.user.id,
      tags,
    });
    this.eventEmitter.emit('new.post', post);
    return post;
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @OnEvent('new.post')
  @Sse('update')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'new.post').pipe(
      map((data) => {
        return new MessageEvent('new.post', { data: JSON.stringify(data) });
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findUserPosts(@Param('userId') userId: string) {
    return this.postService.findAllUserPosts(+userId);
  }
}
