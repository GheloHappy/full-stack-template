import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateExampleDto } from './dto/create-example.dto';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.example.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(input: CreateExampleDto) {
    return this.prisma.example.create({ data: input });
  }
}
