import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AutoridadeEnvolvida } from 'src/entities/autoridade_envolvida.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { response } from 'express';

@Injectable()
export class AutoridadeEnvolvidaService {
  constructor(
    @InjectRepository(AutoridadeEnvolvida)
    readonly autoridadeEnvolvidaRepo: Repository<AutoridadeEnvolvida>,
  ) {}

  async insertData(autoridadeEnvolvida: Partial<AutoridadeEnvolvida>) {
    try {
      await this.autoridadeEnvolvidaRepo.insert(autoridadeEnvolvida);
    } catch {}
  }

  readFromCsv() {
    const file = fs.readFileSync('src/data/acidentes.csv', 'utf-8');
    const allFileData = file.split('\n');
    return allFileData;
  }

  async runScript() {
    const fileData = this.readFromCsv().slice(1);
    let i = 0;
    let promises = [];
    for (const row of fileData) {
      console.time('a');
      const rowData = row.split(',');
      const autoridadeEnvolvidaProps = rowData.slice(-3);
      console.log('props', autoridadeEnvolvidaProps);
      const autoridadeEnvolvida: Partial<AutoridadeEnvolvida> = {
        id: i,
        regional: autoridadeEnvolvidaProps[0],
        delegacia: autoridadeEnvolvidaProps[1],
        uop: autoridadeEnvolvidaProps[2].replace('\r', ''),
      };
      console.log('item', autoridadeEnvolvida);
      try {
        promises.push(this.insertData(autoridadeEnvolvida));
        i += 1;
        if (i % 100 == 0) {
          console.log('Commit Result');
          console.log(promises);

          const resolvedPromises = await Promise.allSettled(promises);

          console.log(resolvedPromises);
          promises = [];
        }
      } catch (err) {
        console.log(err.detail);
      }
      console.timeEnd('a');
    }
    console.log('Commit Result');
    await Promise.all(promises);
  }
}
