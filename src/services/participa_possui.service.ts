import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { PossuiVeiculo } from 'src/entities/possui_veiculo.entity';
import { Participa } from 'src/entities/participa.entity';
import { Acidente } from 'src/entities/acidente.entity';
import { Veiculo } from 'src/entities/veiculo.entity';
import { Envolvido } from 'src/entities/envolvido.entity';

@Injectable()
export class PossuiParticipaService {
  constructor(
    @InjectRepository(Participa)
    readonly participaRepo: Repository<Participa>,
    @InjectRepository(PossuiVeiculo)
    readonly possuiVeiculoRepo: Repository<PossuiVeiculo>,
    @InjectRepository(Acidente)
    readonly acidenteRepo: Repository<Acidente>,
    @InjectRepository(Veiculo)
    readonly veiculoRepo: Repository<Veiculo>,
    @InjectRepository(Envolvido)
    readonly envolvidoRepo: Repository<Envolvido>,
  ) {}

  async insertParticipaData(participas: Partial<Participa>[]) {
    try {
      await this.participaRepo.insert(participas);
    } catch (error) {
      //   console.log('failed participas!');
      //   console.log(participas);
      //   console.log(error);
    }
  }

  async insertPossuiData(possuis: Partial<PossuiVeiculo>[]) {
    try {
      await this.possuiVeiculoRepo.insert(possuis);
    } catch (error) {
      //   console.log('failed possuis!');
      //   console.log(possuis);
      //   console.log(error);
    }
  }

  async getAcidenteData() {
    let acidenteArr: Acidente[];
    acidenteArr = await this.acidenteRepo.find();
    return acidenteArr;
  }

  async getVeiculoData() {
    let veiculoArr: Veiculo[];
    veiculoArr = await this.veiculoRepo.find();
    return veiculoArr;
  }

  async getEnvolvidoData() {
    let envolvidoArr: Envolvido[];
    envolvidoArr = await this.envolvidoRepo.find();
    return envolvidoArr;
  }

  readFromCsv() {
    const file = fs.readFileSync('src/data/acidentes.tsv', 'utf-8');
    const allFileData = file.split('\n');
    return allFileData;
  }

  async runScript() {
    console.log('Started!');
    console.time('Removing repeated...');
    const fileData = this.readFromCsv().slice(1);
    // const veiculoData = await this.getVeiculoData();
    // const envolvidoData = await this.getEnvolvidoData();
    const acidenteData = await this.getAcidenteData();
    let tempParticipa = [];
    let tempPossuiVeiculo = [];
    let j = 0;
    for (const row of fileData) {
      if (j % 1000 === 0) {
        console.log(j);
      }
      j++;
      const rowData = row.split('\t');
      const dataInversa = rowData[2];
      const horario = rowData[4];
      const acidente: Partial<Acidente> = {
        causa: rowData[9],
        tipo: rowData[10],
        classificacao: rowData[11],
        faseDia: rowData[12],
        condMeteo: rowData[14],
        ilesos: +rowData[26],
        feridosLeves: +rowData[27],
        feridosGraves: +rowData[28],
        morte: +rowData[29] == 1,
      };
      const acidenteId = acidenteData.find((acidenteArg) => {
        return (
          acidenteArg.causa === acidente.causa &&
          acidenteArg.tipo === acidente.tipo &&
          acidenteArg.classificacao === acidente.classificacao &&
          acidenteArg.faseDia === acidente.faseDia &&
          acidenteArg.condMeteo === acidente.condMeteo &&
          acidenteArg.ilesos === acidente.ilesos &&
          acidenteArg.feridosLeves === acidente.feridosLeves &&
          acidenteArg.feridosGraves === acidente.feridosGraves &&
          acidenteArg.morte === acidente.morte
        );
      })?.id;
      const pesid = +rowData[1] || null;
      const veiculoId = +rowData[18];
      const participa: Partial<Participa> = {
        idAcidente: acidenteId,
        idEnvolvido: pesid,
      };
      const possuiVeiculo: Partial<PossuiVeiculo> = {
        idAcidente: acidenteId,
        idVeiculo: veiculoId,
      };
      tempParticipa.push(JSON.stringify(participa));
      tempPossuiVeiculo.push(JSON.stringify(possuiVeiculo));
    }
    tempParticipa = tempParticipa.filter((participa) => {
      const participaObj = JSON.parse(participa) as Participa;
      //   if (participaObj.idAcidente === 108119) console.log(participaObj);
      return (
        (participaObj.idAcidente || participaObj.idAcidente === 0) &&
        (participaObj.idEnvolvido || participaObj.idEnvolvido === 0)
      );
    });
    tempPossuiVeiculo = tempPossuiVeiculo.filter((possuiVeiculo) => {
      const possuiVeiculoObj = JSON.parse(possuiVeiculo) as PossuiVeiculo;
      //   if (possuiVeiculoObj.idAcidente === 108119) console.log(possuiVeiculoObj);
      return (
        (possuiVeiculoObj.idAcidente || possuiVeiculoObj.idAcidente === 0) &&
        (possuiVeiculoObj.idVeiculo || possuiVeiculoObj.idVeiculo === 0)
      );
    });
    const participas: Partial<Participa>[] = [...new Set(tempParticipa)].map(
      (participa) => JSON.parse(participa),
    );
    const possuis: Partial<PossuiVeiculo>[] = [
      ...new Set(tempPossuiVeiculo),
    ].map((possui) => JSON.parse(possui));
    console.timeEnd('Removing repeated...');
    const promisesPossuiVeiculo = [];
    const promisesParticipa = [];
    console.time('Pushing to database...');
    let participaData = [];
    let possuiVeiculoData = [];
    let i = 0;
    const possuiFilePath = 'src/data/possui.csv';
    const participaFilePath = 'src/data/participa.csv';
    fs.appendFileSync(participaFilePath, 'id_acidente;id_envolvido\n');
    fs.appendFileSync(possuiFilePath, 'id_acidente;id_veiculo\n');
    for (const participa of participas) {
      fs.appendFileSync(
        participaFilePath,
        [participa.idAcidente, participa.idEnvolvido].join(';') + '\n',
      );
      // participaData.push(participa);
      // if (i % 1000 == 0) {
      //   promisesParticipa.push(this.insertParticipaData(participaData));
      //   participaData = [];
      // }
      // i += 1;
    }
    i = 0;
    for (const possui of possuis) {
      fs.appendFileSync(
        possuiFilePath,
        [possui.idAcidente, possui.idVeiculo].join(';') + '\n',
      );
      // possuiVeiculoData.push(possui);
      // if (i % 1000 == 0) {
      //   promisesPossuiVeiculo.push(this.insertPossuiData(possuiVeiculoData));
      //   possuiVeiculoData = [];
      // }
      // i += 1;
    }
    promisesPossuiVeiculo.push(this.insertParticipaData(possuiVeiculoData));
    promisesParticipa.push(this.insertPossuiData(participaData));
    await Promise.all(promisesParticipa.concat(promisesPossuiVeiculo));
    console.timeEnd('Pushing to database...');
    console.log('END!');
  }
}
