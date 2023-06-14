import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoridadeEnvolvida } from './entities/autoridade_envolvida.entity';
import { Envolvido } from './entities/envolvido.entity';
import { Veiculo } from './entities/veiculo.entity';
import { PossuiVeiculo } from './entities/possui_veiculo.entity';
import { Participa } from './entities/participa.entity';
import { Rodovia } from './entities/rodovia.entity';
import { Medicao } from './entities/medicao.entity';
import { Infracao } from './entities/infracao.entity';
import { Acidente } from './entities/acidente.entity';
import { ConfigModule } from '@nestjs/config';
import { AutoridadeEnvolvidaService } from './services/autoridade-envolvida.service';
import { MiscService } from './services/misc.service';
import { VeiculoService } from './services/veiculo.service';
import { EnvolvidoService } from './services/envolvido.service';
import { RodoviaService } from './services/rodovia.service';
import { AcidenteService } from './services/acidente.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      port: +process.env.PGPORT,
      entities: [
        AutoridadeEnvolvida,
        Envolvido,
        Veiculo,
        PossuiVeiculo,
        Participa,
        Rodovia,
        Medicao,
        Infracao,
        Acidente,
      ],
      database: process.env.PGDATABASE,
      schema: 'trabalho',
      synchronize: false,
      extra: {
        ssl: true,
      },
    }),
    TypeOrmModule.forFeature([
      AutoridadeEnvolvida,
      Envolvido,
      Veiculo,
      PossuiVeiculo,
      Participa,
      Rodovia,
      Medicao,
      Infracao,
      Acidente,
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AutoridadeEnvolvidaService,
    MiscService,
    VeiculoService,
    EnvolvidoService,
    RodoviaService,
    AcidenteService,
  ],
})
export class AppModule {}
