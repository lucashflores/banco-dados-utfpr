import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rodovia } from './rodovia.entity';
import { AutoridadeEnvolvida } from './autoridade_envolvida.entity';
import { PossuiVeiculo } from './possui_veiculo.entity';
import { Participa } from './participa.entity';

@Entity({ name: 'acidente', synchronize: false })
export class Acidente {
  @PrimaryGeneratedColumn('increment', { name: 'id_acidente' })
  id: number;

  @Column({ type: 'int', name: 'feridos_graves' })
  feridosGraves: number;

  @Column({ type: 'int', name: 'feridos_leves' })
  feridosLeves: number;

  @Column({ type: 'int' })
  ilesos: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  classificacao: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  tipo: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  causa: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'fase_do_dia' })
  faseDia: string;

  @Column({ type: 'varchar', length: 255, default: '', name: 'cond_meteo' })
  condMeteo: string;

  @Column({ type: 'timestamp without time zone' })
  timestamp: Date;

  @Column({ type: 'bool' })
  morte: boolean;

  @Column({ type: 'int', name: 'id_rodovia' })
  rodoviaId: number;

  @Column({ type: 'int', name: 'id_autoridade' })
  autoridadeId: number;

  @ManyToOne((type) => Rodovia, (rodovia) => rodovia.acidentes)
  @JoinColumn({ name: 'id_rodovia' })
  rodovia: Rodovia;

  @ManyToOne(
    (type) => AutoridadeEnvolvida,
    (autoridadeEnvolvida) => autoridadeEnvolvida.acidentes,
  )
  @JoinColumn({ name: 'id_autoridade' })
  autoridade: AutoridadeEnvolvida;

  // @OneToMany((type) => PossuiVeiculo, (possuiVeiculo) => possuiVeiculo.acidente)
  // veiculos: PossuiVeiculo[];

  @OneToMany((type) => Participa, (participa) => participa.acidente)
  envolvidos: Participa[];
}
