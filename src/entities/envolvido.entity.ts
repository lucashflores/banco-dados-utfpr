import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participa } from './participa.entity';

@Entity({ name: 'envolvido', synchronize: false })
export class Envolvido {
  @PrimaryColumn({ name: 'id_envolvido', type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'tipo' })
  tipo: string;

  @Column({ type: 'varchar', length: 255, name: 'estado_fisico' })
  estadoFisico: string;

  @Column({ type: 'int', name: 'idade' })
  idade: number;

  @Column({ type: 'varchar', length: 255, name: 'sexo' })
  sexo: string;

  @OneToMany((type) => Participa, (participa) => participa.envolvido)
  acidentes: Participa[];
}
