import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Infracao } from 'src/entities/infracao.entity';
import { Medicao } from 'src/entities/medicao.entity';
import { Rodovia } from 'src/entities/rodovia.entity';
import { AutoridadeEnvolvida } from 'src/entities/autoridade_envolvida.entity';

@Injectable()
export class InfracaoMedicaoService {
  constructor(
    @InjectRepository(Infracao)
    readonly infracaoRepo: Repository<Infracao>,
    @InjectRepository(Medicao)
    readonly medicaoRepo: Repository<Medicao>,
    @InjectRepository(Rodovia)
    readonly rodoviaRepo: Repository<Rodovia>,
  ) {}

  async insertInfracaoData(infracoes: Partial<Infracao>[]) {
    try {
      await this.infracaoRepo.insert(infracoes);
    } catch (error) {
      console.log('##### failed infracoes! #####');
      // console.log(infracoes);
      // console.log(error);
    }
  }

  async insertMedicaoData(medicoes: Partial<Medicao>[]) {
    try {
      await this.medicaoRepo.insert(medicoes);
    } catch (error) {
      console.log('##### failed medicoes! #####');
      console.log(medicoes);
      console.log(error);
    }
  }

  readFromCsv() {
    const file = fs.readFileSync('src/data/infraçoes2021_02.csv', 'latin1');
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
    console.timeEnd('Getting rodoviaData...');
    console.time('Removing repeated...');
    const fileData = this.readFromCsv().slice(1);
    let tempInfracao = [];
    let tempMedicao = [];
    let j = 0;
    const ids = [];
    for (const row of fileData) {
      if (j % 1000 === 0) console.log(j);
      j++;
      const rowData = row.split(';').map((prop) => prop?.replace(/"/g, ''));
      const dataInversa = rowData[1];
      const horario = rowData[18];
      const timestamp = new Date(`${dataInversa} ${horario}:00:00`);
      const rodovia = {
        uf: rowData[6],
        br: +rowData[7],
        km: +rowData[8]?.replace(',', '.'),
        municipio: rowData[9],
        sentido: rowData[5] == 'NA' ? null : rowData[5],
      };
      //   const rodoviaId = await this.searchRodoviaId(rodovia);
      const rodoviaId = rodoviaData.find(
        (rodoviaArg) =>
          rodoviaArg?.br === rodovia?.br &&
          rodoviaArg?.km === rodovia?.km &&
          rodoviaArg?.uf === rodovia?.uf &&
          rodoviaArg?.municipio === rodovia?.municipio &&
          rodoviaArg?.sentido === rodovia?.sentido,
      )?.id;

      const infracao: Partial<Infracao> = {
        id: rowData[0],
        codgInfracao: +rowData[10],
        idRodovia: rodoviaId,
        timestamp,
        dataDeVigencia: new Date(rowData[13] + ' ' + '12:00:00'),
        marca: rowData[17],
        descricao: rowData[11],
        enquadramento: rowData[12],
      };

      const medicao: Partial<Medicao> = {
        numAuto: infracao?.id,
        tipo: rowData[15],
        valor: +rowData[19]?.replace(',', '.'),
        excesso: +rowData[20]?.replace(',', '.'),
      };
      if (!ids.includes(infracao.id)) {
        tempInfracao.push(JSON.stringify(infracao));
        tempMedicao.push(JSON.stringify(medicao));
      }
      ids.push(infracao.id);
    }
    const infracoes: Partial<Infracao>[] = [...new Set(tempInfracao)]
      .map((infracao) => JSON.parse(infracao))
      .filter((infracao) => infracao?.id);
    const medicoes: Partial<Medicao>[] = [...new Set(tempMedicao)]
      .map((medicao) => JSON.parse(medicao))
      .filter((medicao) => medicao?.numAuto);
    console.timeEnd('Removing repeated...');
    // const infracoesFilePath = 'src/data/infracoes_data.csv';
    // const medicoesFilePath = 'src/data/medicoes_data.csv';
    // fs.appendFileSync(
    // infracoesFilePath,
    // 'num_auto;codg_infracao;timestamp;marca;descricao;data_de_vigencia;enquadramento;id_rodovia\n',
    // );
    // fs.appendFileSync(medicoesFilePath, 'num_auto;tipo;valor;excesso\n');
    const medicoesPromises = [];
    const infracoesPromises = [];
    console.time('Pushing to database...');
    let infracoesData = [];
    let medicoesData = [];
    let i = 1;
    for (const infracao of infracoes) {
      infracoesData.push(infracao);
      if (i % 1000 == 0) {
        infracoesPromises.push(this.insertInfracaoData(infracoesData));
        infracoesData = [];
      }
      // fs.appendFileSync(
      //   infracoesFilePath,
      //   [
      //     infracao.id,
      //     infracao.codgInfracao,
      //     infracao.timestamp,
      //     infracao.marca,
      //     infracao.descricao,
      //     infracao.dataDeVigencia,
      //     infracao.enquadramento,
      //     infracao.idRodovia,
      //   ].join(';') + '\n',
      // );
      i += 1;
    }
    infracoesPromises.push(this.insertInfracaoData(infracoesData));
    await Promise.all(infracoesPromises);
    i = 1;
    for (const medicao of medicoes) {
      medicoesData.push(medicao);
      if (i % 1000 == 0) {
        medicoesPromises.push(this.insertMedicaoData(medicoesData));
        medicoesData = [];
      }
      // fs.appendFileSync(
      //   medicoesFilePath,
      //   [medicao.numAuto, medicao.tipo, medicao.valor, medicao.excesso].join(
      //     ';',
      //   ) + '\n',
      // );
    }
    medicoesPromises.push(this.insertMedicaoData(medicoesData));
    await Promise.all(medicoesPromises);
    console.timeEnd('Pushing to database...');
    console.log('END!');
  }
}
