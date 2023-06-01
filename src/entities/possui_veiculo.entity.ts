import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Acidente } from './acidente.entity';
import { Veiculo } from './veiculo.entity';

@Entity({ name: 'possui_veiculo', synchronize: false })
export class PossuiVeiculo {
  @PrimaryColumn('uuid', { name: 'id_acidente' })
  idAcidente: string;

  @PrimaryColumn('uuid', { name: 'id_veiculo' })
  idVeiculo: string;

  @ManyToOne((type) => Acidente, (acidente) => acidente.veiculos)
  @JoinColumn({ name: 'id_acidente' })
  acidente: Acidente;

  @ManyToOne((type) => Veiculo, (veiculo) => veiculo.acidentes)
  @JoinColumn({ name: 'id_acidente' })
  veiculo: Veiculo;
}
