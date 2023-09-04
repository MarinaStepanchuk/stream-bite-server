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
} from '@nestjs/common';
import { PostService } from './post.service';
// import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Req() req, @Body() body) {
    const tags = JSON.parse(body.tags);
    return this.postService.create({
      file,
      id: +req.user.id,
      tags,
    });
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('user/:userId')
  findUserPosts(@Param('userId') userId: string) {
    return this.postService.findAllUserPosts(+userId);
  }
}
