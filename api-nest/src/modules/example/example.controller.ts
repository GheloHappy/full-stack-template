import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { ExampleService } from './example.service';

@Controller('examples')
export class ExampleController {
  constructor(private readonly examples: ExampleService) {}

  @Get()
  findAll() {
    return this.examples.findAll();
  }

  @Post()
  create(@Body() input: CreateExampleDto) {
    return this.examples.create(input);
  }
}
