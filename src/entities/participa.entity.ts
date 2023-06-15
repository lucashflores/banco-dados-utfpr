import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Acidente } from './acidente.entity';
import { Envolvido } from './envolvido.entity';

@Entity({ name: 'participa', synchronize: false })
export class Participa {
  @PrimaryColumn({ name: 'id_acidente', type: 'int4' })
  idAcidente: number;

  @PrimaryColumn({ name: 'id_envolvido', type: 'int4' })
  idEnvolvido: number;

  @ManyToOne((type) => Acidente, (acidente) => acidente.envolvidos)
  @JoinColumn({ name: 'id_acidente' })
  acidente: Acidente;

  @ManyToOne((type) => Envolvido, (envolvido) => envolvido.acidentes)
  @JoinColumn({ name: 'id_envolvido' })
  envolvido: Envolvido;
}
