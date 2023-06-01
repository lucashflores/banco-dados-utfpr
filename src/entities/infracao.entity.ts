import {
  Column,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { Medicao } from './medicao.entity';
import { Rodovia } from './rodovia.entity';

@Entity({ name: 'infracao', synchronize: false })
export class Infracao {
  @PrimaryColumn({ name: 'num_auto', type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'int', name: 'codg_infracao' })
  codgInfracao: number;

  @Column({ type: 'int', name: 'medicao' })
  medicao: number;

  @Column({ type: 'int', name: 'id_rodovia' })
  idRodovia: number;

  @Column({ type: 'timestamp without time zone' })
  timestamp: Date;

  @Column({ type: 'date', name: 'data_de_vigencia' })
  dataDeVigencia: Date;

  @Column({ type: 'varchar', length: 255, default: '', name: 'local' })
  local: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'marca' })
  marca: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'descricao' })
  descricao: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'enquadramento' })
  enquadramento: string;

  @ManyToOne((type) => Rodovia, (rodovia) => rodovia.infracoes)
  @JoinColumn({ name: 'id_rodovia' })
  rodovia: Rodovia;

  @OneToOne((type) => Medicao, (medicao) => medicao.infracao)
  medicaoEntity: Medicao;
}

/*CREATE TABLE Infracao (
    Num_Auto INT PRIMARY KEY,
    codg_Infracao INT,
    timestamp TIMESTAMP,
    local VARCHAR(255),
    marca VARCHAR(255),
    descricao VARCHAR(255),
    data_de_vigencia DATE,
    enquadramento VARCHAR(255),
    medicao INT,
    ID_Rodovia INT,
    FOREIGN KEY (ID_Rodovia) REFERENCES Rodovia (ID_Rodovia)
  );*/
