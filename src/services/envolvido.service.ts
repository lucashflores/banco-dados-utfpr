import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Envolvido } from 'src/entities/envolvido.entity';

@Injectable()
export class EnvolvidoService {
  constructor(
    @InjectRepository(Envolvido)
    readonly envolvidoRepo: Repository<Envolvido>,
  ) {}

  async insertData(envolvidos: Partial<Envolvido>[]) {
    try {
      await this.envolvidoRepo.insert(envolvidos);
    } catch (error) {
      console.log('failed!');
      console.log(envolvidos);
      console.log(error?.detail);
    }
  }

  readFromCsv() {
    const file = fs.readFileSync('src/data/acidentes.tsv', 'utf-8');
    const allFileData = file.split('\n');
    return allFileData;
  }
  // 18 19 20 21
  async runScript() {
    console.time('Removing repeated...');
    const fileData = this.readFromCsv().slice(1);
    const temp = fileData
      .map((row) => {
        const rowData = row.split('\t');
        const envolvidoProps = rowData.slice(22, 26);
        envolvidoProps.push(rowData[1]);
        const envolvido: Partial<Envolvido> = {
          id: +envolvidoProps[4],
          tipo: envolvidoProps[0],
          estadoFisico: envolvidoProps[1],
          idade: +envolvidoProps[2],
          sexo: envolvidoProps[3],
        };
        return JSON.stringify(envolvido);
      })
      .filter((envolvidoStr, index) => {
        const envolvidoObj = JSON.parse(envolvidoStr);
        return !!envolvidoObj.id;
      });
    const envolvidos = [...new Set(temp)].map((envolvido) =>
      JSON.parse(envolvido),
    );
    console.timeEnd('Removing repeated...');
    const promises = [];
    console.time('Pushing to database...');
    let envolvidosData = [];
    let i = 0;
    for (const envolvido of envolvidos) {
      envolvidosData.push(envolvido);
      if (i % 1000 == 0) {
        promises.push(this.insertData(envolvidosData));
        envolvidosData = [];
      }
      i += 1;
    }
    promises.push(this.insertData(envolvidosData));
    await Promise.all(promises);
    console.timeEnd('Pushing to database...');
    console.log('END!');
  }
}
