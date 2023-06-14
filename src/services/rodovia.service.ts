import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AutoridadeEnvolvida } from 'src/entities/autoridade_envolvida.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { response } from 'express';
import { Rodovia } from 'src/entities/rodovia.entity';

@Injectable()
export class RodoviaService {
  constructor(
    @InjectRepository(Rodovia)
    readonly rodoviaRepo: Repository<Rodovia>,
  ) {}

  async insertData(rodovias: Partial<Rodovia>[]) {
    try {
      await this.rodoviaRepo.insert(rodovias);
    } catch {}
  }

  readFromCsv(fileName: string) {
    const file = fs.readFileSync(`src/data/${fileName}`, 'utf-8');
    const allFileData = file.split('\n');
    return allFileData;
  }

  async runScript() {
    const hashMap = {};
    await this.runScriptInfracoes(hashMap);
  }

  async runScriptInfracoes(hashMap) {
    let infracoesIdx = 1;
    for (infracoesIdx; infracoesIdx < 13; infracoesIdx++) {
      console.time('Removing repeated...');
      const fileName = `infraçoes2021_${
        infracoesIdx < 10 ? '0' + infracoesIdx : infracoesIdx
      }.csv`;
      const fileData = this.readFromCsv(fileName).slice(1);
      const rodovias = fileData
        .map((row) => {
          const rowData = row.split(';');
          try {
            if (rowData[0] === '' || rowData[7] === 'NA' || rowData[8] === 'NA')
              return null;
            console.log(rowData[7]);
            console.log(+rowData[7]);
            const rodovia: Partial<Rodovia> = {
              uf: rowData[6],
              br: +rowData[7],
              km: +rowData[8].replace(',', '.'),
              municipio: rowData[9],
              sentido: rowData[5] == 'NA' ? null : rowData[5],
            };
            if (
              !hashMap[
                [rodovia.uf, rodovia.br, rodovia.km, rodovia.sentido].join('')
              ]
            ) {
              hashMap[
                [rodovia.uf, rodovia.br, rodovia.km, rodovia.sentido].join('')
              ] = true;
              return rodovia;
            }
            return null;
          } catch (err) {
            console.log(rowData);
          }
        })
        .filter((rodovia) => rodovia);
      console.timeEnd('Removing repeated...');
      const promises = [];
      console.time('Pushing to database...');
      let rodoviasData = [];
      let i = 0;
      for (const rodovia of rodovias) {
        // console.log(rodovia);
        rodoviasData.push(rodovia);
        if (i % 1000 == 0) {
          promises.push(this.insertData(rodoviasData));
          rodoviasData = [];
        }
        i += 1;
      }
      promises.push(this.insertData(rodoviasData));
      //   console.log(rodoviasData[0]);
      //   console.log(rodoviasData[1]);
      //   console.log(rodoviasData[2]);
      await Promise.all(promises);
      console.timeEnd('Pushing to database...');
      console.log('Data pushed!');
    }
    console.log('END!');
  }

  async runScriptAcidente() {
    console.time('Removing repeated...');
    const fileData = this.readFromCsv('acidentes.tsv').slice(1);
    const hashMap = {};
    const rodovias = fileData
      .map((row) => {
        const rowData = row.split('\t');
        if (rowData[6] === 'NA' || rowData[7] === 'NA') return null;
        const rodovia: Partial<Rodovia> = {
          uf: rowData[5],
          br: +rowData[6],
          km: +rowData[7].replace(',', '.'),
          municipio: rowData[8],
          sentido:
            rowData[13] == 'Decrescente' ? 'D' : 'Crescente' ? 'C' : null,
          tipo: rowData[15],
          tracado: rowData[16],
          usoSolo: rowData[17],
          lat: +rowData[30].replace(',', '.'),
          long: +rowData[31].replace(',', '.'),
        };
        if (
          !hashMap[
            [rodovia.uf, rodovia.br, rodovia.km, rodovia.sentido].join('')
          ]
        ) {
          hashMap[
            [rodovia.uf, rodovia.br, rodovia.km, rodovia.sentido].join('')
          ] = true;
          return rodovia;
        }
        return null;
      })
      .filter((rodovia) => rodovia);
    console.timeEnd('Removing repeated...');
    const promises = [];
    console.time('Pushing to database...');
    let rodoviasData = [];
    let i = 0;
    for (const rodovia of rodovias) {
      rodoviasData.push(rodovia);
      if (i % 1000 == 0) {
        promises.push(this.insertData(rodoviasData));
        rodoviasData = [];
      }
      i += 1;
    }
    promises.push(this.insertData(rodoviasData));
    await Promise.all(promises);
    console.timeEnd('Pushing to database...');
    console.log('END!');
  }
}
