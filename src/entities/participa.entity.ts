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
  @PrimaryColumn('uuid', { name: 'id_acidente' })
  idAcidente: string;

  @PrimaryColumn('uuid', { name: 'id_envolvido' })
  idEnvolvido: string;

  @ManyToOne((type) => Acidente, (acidente) => acidente.envolvidos)
  @JoinColumn({ name: 'id_acidente' })
  acidente: Acidente;

  @ManyToOne((type) => Envolvido, (envolvido) => envolvido.acidentes)
  @JoinColumn({ name: 'id_envolvido' })
  envolvido: Envolvido;
}
