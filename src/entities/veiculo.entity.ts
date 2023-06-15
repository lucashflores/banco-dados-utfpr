import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PossuiVeiculo } from './possui_veiculo.entity';

@Entity({ name: 'veiculo', synchronize: false })
export class Veiculo {
  @PrimaryColumn({ name: 'id_veiculo', type: 'int4' })
  id: number;

  @Column({ name: 'tipo', type: 'varchar', length: 255, default: '' })
  tipo: string;

  @Column({ name: 'marca', type: 'varchar', length: 255, default: '' })
  marca: string;

  @Column({ name: 'ano_fabricacao', type: 'int' })
  anoFabricacao: number;

  // @OneToMany((type) => PossuiVeiculo, (possuiVeiculo) => possuiVeiculo.veiculo)
  // acidentes: PossuiVeiculo[];
}
