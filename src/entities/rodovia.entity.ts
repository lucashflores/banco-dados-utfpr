import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Acidente } from './acidente.entity';
import { Infracao } from './infracao.entity';

@Entity({ name: 'rodovia' })
export class Rodovia {
  @PrimaryGeneratedColumn('uuid', { name: 'id_rodovia' })
  id: string;

  @Column({ name: 'uf', type: 'varchar', length: 255 })
  uf: string;

  @Column({ name: 'br', type: 'int' })
  br: number;

  @Column({ name: 'km', type: 'float' })
  km: number;

  @Column({ name: 'lat', type: 'float' })
  lat: number;

  @Column({ name: 'long', type: 'float' })
  long: number;

  @Column({ name: 'municipio', type: 'varchar', length: 255, default: '' })
  municipio: string;

  @Column({ name: 'tipo', type: 'varchar', length: 255, default: '' })
  tipo: string;

  @Column({ name: 'sentido', type: 'varchar', length: 255, default: '' })
  sentido: string;

  @Column({ name: 'tracado', type: 'varchar', length: 255, default: '' })
  tracado: string;

  @Column({ name: 'uso_solo', type: 'varchar', length: 255, default: '' })
  usoSolo: string;

  @OneToMany((type) => Acidente, (acidente) => acidente.rodovia)
  acidentes: Acidente[];

  @OneToMany((type) => Infracao, (infracao) => infracao.rodovia)
  infracoes: Infracao[];
}

// nullable: true;
// default: 3;
