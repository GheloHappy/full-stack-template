import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import sql from 'mssql';
import { DatabaseService } from '../../database/database.service';
import type { CreateExampleDto } from './dto/create-example.dto';

interface ExampleRecord {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ExampleService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    if (this.database.provider === 'postgresql') {
      return this.database.postgres.example.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    const result = await this.database.mssql.request().query<ExampleRecord>(`
      SELECT id, name, created_at AS createdAt, updated_at AS updatedAt
      FROM dbo.examples
      ORDER BY created_at DESC
    `);
    return result.recordset;
  }

  async create(input: CreateExampleDto) {
    if (this.database.provider === 'postgresql') {
      return this.database.postgres.example.create({ data: input });
    }

    const id = randomUUID();
    const result = await this.database.mssql
      .request()
      .input('id', sql.UniqueIdentifier, id)
      .input('name', sql.NVarChar(120), input.name).query<ExampleRecord>(`
        INSERT INTO dbo.examples (id, name) VALUES (@id, @name);
        SELECT id, name, created_at AS createdAt, updated_at AS updatedAt
        FROM dbo.examples
        WHERE id = @id;
      `);
    return result.recordset[0];
  }
}
