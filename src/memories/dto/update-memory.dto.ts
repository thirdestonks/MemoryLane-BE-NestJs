import { PartialType } from '@nestjs/mapped-types';
import { CreateMemoryDto } from './create-memory.dto';

export class UpdateMemoryDto extends PartialType(CreateMemoryDto) {}
