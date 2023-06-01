import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PossuiVeiculo } from './possui_veiculo.entity';

@Entity({ name: 'veiculo', synchronize: false })
export class Veiculo {
  @PrimaryGeneratedColumn('increment', { name: 'id_veiculo' })
  id: number;

  @Column({ name: 'tipo', type: 'varchar', length: 255, default: '' })
  tipo: string;

  @Column({ name: 'marca', type: 'varchar', length: 255, default: '' })
  marca: string;

  @Column({ name: 'ano_fabricacao', type: 'int' })
  anoFabricacao: number;

  @OneToMany((type) => PossuiVeiculo, (possuiVeiculo) => possuiVeiculo.veiculo)
  acidentes: PossuiVeiculo[];
}
