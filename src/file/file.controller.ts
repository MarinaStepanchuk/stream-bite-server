import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':userId/:name')
  async getStaticFile(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('name') name: string,
  ) {
    const { mimeType, stream } = await this.fileService.getFile(userId, name);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename=${name}`,
    });
    stream.pipe(res);
  }
}
