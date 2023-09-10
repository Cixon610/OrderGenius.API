import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLineAccountDto } from 'src/core/models';
import { LineAccount } from 'src/infra/typeorm';

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

  findLineAccountByLineId(lineId: string) {
    return this.lineAccountRepository.findOne({ where: { lineId } });
  }
}
