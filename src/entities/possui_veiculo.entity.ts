import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Acidente } from './acidente.entity';
import { Veiculo } from './veiculo.entity';

@Entity({ name: 'possui_veiculo', synchronize: false })
export class PossuiVeiculo {
  @PrimaryColumn({ name: 'id_acidente', type: 'int4' })
  idAcidente: number;

  @PrimaryColumn({ name: 'id_veiculo', type: 'int4' })
  idVeiculo: number;

  // @ManyToOne((type) => Acidente, (acidente) => acidente.veiculos)
  // @JoinColumn({ name: 'id_acidente' })
  // acidente: Acidente;

  // @ManyToOne((type) => Veiculo, (veiculo) => veiculo.acidentes)
  // @JoinColumn({ name: 'id_veiculo' })
  // veiculo: Veiculo;
}
