import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Infracao } from './infracao.entity';

@Entity({ name: 'medicao', synchronize: false })
export class Medicao {
  @PrimaryColumn({ name: 'num_auto', type: 'varchar', length: 255 })
  numAuto: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  tipo: string;

  @Column({ type: 'float' })
  valor: number;

  @Column({ type: 'float' })
  excesso: number;

  @OneToOne((type) => Infracao, (infracao) => infracao.medicao)
  @JoinColumn({ name: 'num_auto' })
  infracao: Infracao;
}
