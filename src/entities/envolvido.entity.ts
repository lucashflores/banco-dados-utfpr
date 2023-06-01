import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participa } from './participa.entity';

@Entity({ name: 'envolvido', synchronize: false })
export class Envolvido {
  @PrimaryGeneratedColumn('increment', { name: 'id_envolvido' })
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
