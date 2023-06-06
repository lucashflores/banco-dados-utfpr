import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Veiculo } from 'src/entities/veiculo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    readonly veiculoRepo: Repository<Veiculo>,
  ) {}

  async insertData(veiculos: Partial<Veiculo>[]) {
    try {
      await this.veiculoRepo.insert(veiculos);
    } catch {
      console.log('failed!');
      console.log(JSON.stringify(veiculos));
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
    const veiculos = [
      ...new Set(
        fileData.map((row) => {
          const rowData = row.split('\t');
          const veiculoProps = rowData.slice(18, 22);
          const veiculo: Partial<Veiculo> = {
            id: +veiculoProps[0],
            tipo: veiculoProps[1],
            marca: veiculoProps[2],
            anoFabricacao: +veiculoProps[3],
          };
          return JSON.stringify(veiculo);
        }),
      ),
    ].map((veiculo) => JSON.parse(veiculo));
    console.timeEnd('Removing repeated...');
    const promises = [];
    console.time('Pushing to database...');
    let veiculosData = [];
    let i = 0;
    for (const veiculo of veiculos) {
      veiculosData.push(veiculo);
      if (i % 1000 == 0) {
        promises.push(this.insertData(veiculosData));
        veiculosData = [];
      }
      i += 1;
    }
    promises.push(this.insertData(veiculosData));
    await Promise.all(promises);
    console.timeEnd('Pushing to database...');
    console.log('END!');
  }
}
