import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { MemoriesQuery } from './query/memories-query';
import { CustomFileTypeValidator } from '../common/validators/custom-file-type-validator';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/common/types/model-types';

@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createMemory(
    @Body() createMemoryDto: CreateMemoryDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1MB
          new CustomFileTypeValidator({ fileType: ['jpeg', 'jpg', 'png'] }),
        ],
      })
    ) file?: Express.Multer.File,
  ) {
    const authUser = req.user as AuthUser;
    return this.memoriesService.create(createMemoryDto, file, authUser.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAll(
    @Query() query: MemoriesQuery,
  ) {
    return this.memoriesService.getAll(query);
  }

  @Get('memory/:id')
  async getMemory(@Param('id') id: string) {
    return this.memoriesService.getMemory(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemoryDto: UpdateMemoryDto) {
    return this.memoriesService.update(+id, updateMemoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memoriesService.remove(+id);
  }
}
