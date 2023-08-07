import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLineAccountDto } from 'src/auth/controllers/line/line.dto';
import { LineAccount } from 'src/typeorm';

@Injectable()
export class LineService {
  constructor(
    @InjectRepository(LineAccount)
    private readonly lineAccountRepository: Repository<LineAccount>,
  ) {}

  createLineAccount(createLineAccountDto: CreateLineAccountDto) {
    const newLineAccount =
      this.lineAccountRepository.create(createLineAccountDto);
    return this.lineAccountRepository.save(newLineAccount);
  }

  findLineAccountByLineId(line_id: string) {
    return this.lineAccountRepository.findOne({ where: { line_id } });
  }
}
