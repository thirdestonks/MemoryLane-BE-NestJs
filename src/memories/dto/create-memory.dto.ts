// create-memory.dto.ts
import { IsOptional, IsString } from 'class-validator'

export class CreateMemoryDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  file?: string

  @IsOptional()
  @IsString()
  filePath?: string
}