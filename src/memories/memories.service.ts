import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { MemoriesQuery } from './query/memories-query';
import { PrismaService } from '../prisma.service';
import { Pagination } from '../common/utils/pagination';

@Injectable()
export class MemoriesService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  create(data: CreateMemoryDto, file?: Express.Multer.File, userId?: number) {
    const fileName = file ? file.filename : null;
    const filePath = file ? file.path : null;
    return this.prisma.memory.create({
      data: {
        ...data,
        file: fileName,
        filePath: filePath,
        user: { connect: { id: userId } },
      },
    });
  }

  async getAll(query: MemoriesQuery) {
    const page = Pagination.setPage(Number(query.page));
    const itemsPerPage = Pagination.setItemPerPage(Number(query.per_page));

    const search = query.search || '';
    const whereCondition = MemoriesQuery.search(search);

    const [collection, count] = await this.prisma.$transaction([
      this.prisma.memory.findMany({
        skip: Pagination.skipItems(page, itemsPerPage),
        take: itemsPerPage,
        where: whereCondition,
        orderBy: { created_at: 'desc' },
        include: MemoriesQuery.include(),
      }),
      this.prisma.memory.count({ where: whereCondition }),
    ]);

    const result = {
      data: collection,
      total_items: count,
      items_per_page: itemsPerPage,
      current_page: page,
      previous_page: Pagination.previousPage(page, collection),
      next_page: Pagination.nextPage(page, itemsPerPage, count, collection),
      last_page: Pagination.totalPage(itemsPerPage, count),
      first_page: 1,
    };

    return result;
  }

  async getMemory(id: number) {
    const memory = await this.prisma.memory.findUnique({
      where: { id },
      include: MemoriesQuery.include(),
    });
    if (!memory) {
      throw new NotFoundException(`Memory with ID ${id} not found`);
    }
    return memory;
  }

  async update(id: number, data: UpdateMemoryDto, file?: Express.Multer.File, userId?: number) {
    const memory = await this.getMemory(id);
    if (!memory) {
      throw new NotFoundException(`Memory Not Found`);
    }
    const updatePayload: any = {
      ...data,
    };

    if (file) {
      updatePayload.file = file.filename;
      updatePayload.filePath = file.path;
    }

    if (userId) {
      updatePayload.user = { connect: { id: userId } };
    }

    return this.prisma.memory.update({
      where: { id },
      data: updatePayload,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} memory`;
  }
}
