import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Acidente } from './acidente.entity';

@Entity({ name: 'autoridade_envolvida', synchronize: false })
export class AutoridadeEnvolvida {
  @PrimaryColumn({ name: 'id_autoridade' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  regional: string;

  @Column({ type: 'varchar', length: 255 })
  delegacia: string;

  @Column({ type: 'varchar', length: 255 })
  uop: string;

  @OneToMany((type) => Acidente, (acidente) => acidente.autoridade)
  acidentes: Acidente[];
}
