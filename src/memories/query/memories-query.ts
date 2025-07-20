import { Prisma } from '@prisma/client';
import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MemoriesQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  per_page?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Build Prisma where condition for memory search
   */
  static search(search?: string): Prisma.MemoryWhereInput {
    return search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};
  }

  /**
   * Optional include helper if you ever want user or comments included
   */
  static include(): Prisma.MemoryInclude {
    return {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      comments: true,
    };
  }
}
