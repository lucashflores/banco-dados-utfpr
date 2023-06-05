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
    console.time('Removing repeated...');
    const fileData = this.readFromCsv().slice(1);
    let i = 0;
    const autoridadesArr = [
      ...new Set(
        fileData.map((row) => {
          const rowData = row.split(',');
          const autoridadeEnvolvidaProps = rowData.slice(-3);
          const autoridadeEnvolvida: Partial<AutoridadeEnvolvida> = {
            regional: autoridadeEnvolvidaProps[0],
            delegacia: autoridadeEnvolvidaProps[1],
            uop: autoridadeEnvolvidaProps[2].replace('\r', ''),
          };
          return JSON.stringify(autoridadeEnvolvida);
        }),
      ),
    ].map((autoridade) => {
      const parsedAutoridade = JSON.parse(
        autoridade,
      ) as Partial<AutoridadeEnvolvida>;
      parsedAutoridade.id = i;
      i += 1;
      return parsedAutoridade;
    });
    console.timeEnd('Removing repeated...');
    const promises = [];
    console.time('Pushing to database...');
    for (const autoridade of autoridadesArr) {
      try {
        promises.push(this.insertData(autoridade));
      } catch (err) {
        console.log('error');
        console.log(err.detail);
      }
    }
    await Promise.all(promises);
    console.timeEnd('Pushing to database...');
    console.log('END!');
  }
}
