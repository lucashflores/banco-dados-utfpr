import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Acidente } from 'src/entities/acidente.entity';
import { Rodovia } from 'src/entities/rodovia.entity';

@Injectable()
export class AcidenteService {
  constructor(
    @InjectRepository(Acidente)
    readonly acidenteRepo: Repository<Acidente>,
    @InjectRepository(Rodovia)
    readonly rodoviaRepo: Repository<Rodovia>,
  ) {}

  async insertData(acidentes: Partial<Acidente>[]) {
    try {
      await this.acidenteRepo.insert(acidentes);
    } catch (error) {
      console.log('failed!');
      console.log(acidentes);
      console.log(error?.detail);
    }
  }

  async searchRodoviaId(rodovia: {
    uf: string;
    br: number;
    km: number;
    sentido: string;
    municipio: string;
  }): Promise<number> {
    try {
      return (
        await this.rodoviaRepo.findOne({
          where: rodovia,
        })
      ).id;
    } catch (error) {
      console.log(rodovia);
    }
  }

  readFromCsv() {
    const file = fs.readFileSync('src/data/acidentes.tsv', 'utf-8');
    const allFileData = file.split('\n');
    return allFileData;
  }

  async getRodoviaData() {
    let rodoviaArr: Rodovia[];
    rodoviaArr = await this.rodoviaRepo.find();
    return rodoviaArr;
  }

  async runScript() {
    console.time('Getting rodoviaData...');
    const rodoviaData = await this.getRodoviaData();
    console.log(rodoviaData);
    console.timeEnd('Getting rodoviaData...');
    console.time('Removing repeated...');
    const fileData = this.readFromCsv().slice(1);
    let temp = [];
    let j = 0;
    for (const row of fileData) {
      if (j % 1000 === 0) {
        console.log(j);
      }
      j++;
      const rowData = row.split('\t').map((prop) => prop.replace(/"/g, ''));
      const dataInversa = rowData[2];
      const horario = rowData[4];
      const timestamp = new Date(dataInversa + ' ' + horario);
      const rodovia = {
        uf: rowData[5],
        br: +rowData[6],
        km: +rowData[7].replace(',', '.'),
        municipio: rowData[8],
        sentido: rowData[13] == 'Decrescente' ? 'D' : 'Crescente' ? 'C' : null,
      };
      //   const rodoviaId = await this.searchRodoviaId(rodovia);
      const rodoviaId = rodoviaData.find((rodoviaArg) => {
        rodoviaArg.br === rodovia.br &&
          rodoviaArg.km === rodovia.km &&
          rodoviaArg.uf === rodovia.uf &&
          rodoviaArg.municipio === rodovia.municipio &&
          rodoviaArg.sentido === rodovia.sentido;
      })?.id;
      const acidente: Partial<Acidente> = {
        // id: +rowData[0],
        causa: rowData[9],
        tipo: rowData[10],
        classificacao: rowData[11],
        faseDia: rowData[12],
        condMeteo: rowData[14],
        ilesos: +rowData[26],
        feridosLeves: +rowData[27],
        feridosGraves: +rowData[28],
        morte: +rowData[29] == 1,
        timestamp,
        rodoviaId,
      };
      temp.push(JSON.stringify(acidente));
    }

    // temp = temp.filter((acidenteStr, index) => {
    //   const acidenteObj = JSON.parse(acidenteStr);
    //   return !!acidenteObj.id;
    // });
    const acidentes = [...new Set(temp)].map((acidente) =>
      JSON.parse(acidente),
    );
    console.timeEnd('Removing repeated...');
    const promises = [];
    console.time('Pushing to database...');
    let acidentesData = [];
    let i = 0;
    for (const acidente of acidentes) {
      acidentesData.push(acidente);
      if (i % 1000 == 0) {
        promises.push(this.insertData(acidentesData));
        acidentesData = [];
      }
      i += 1;
    }
    promises.push(this.insertData(acidentesData));
    await Promise.all(promises);
    console.timeEnd('Pushing to database...');
    console.log('END!');
  }
}
