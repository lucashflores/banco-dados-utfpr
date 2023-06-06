import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AutoridadeEnvolvidaService } from './services/autoridade-envolvida.service';
import { MiscService } from './services/misc.service';
import { VeiculoService } from './services/veiculo.service';
import { EnvolvidoService } from './services/envolvido.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(AutoridadeEnvolvidaService)
    private readonly autoridadeEnvolvidaService: AutoridadeEnvolvidaService,
    @Inject(MiscService)
    private readonly miscService: MiscService,
    @Inject(VeiculoService)
    private readonly veiculoService: VeiculoService,
    @Inject(EnvolvidoService)
    private readonly envolvidoService: EnvolvidoService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/merge-files')
  mergeFiles() {
    return this.miscService.mergeTables();
  }

  @Post('/autoridade-envolvida')
  runAutoridadeEnvolvidaScript() {
    const success = false;
    this.autoridadeEnvolvidaService.runScript();
    return success;
  }

  @Post('/veiculo')
  runVeiculoScript() {
    const success = false;
    this.veiculoService.runScript();
    return success;
  }

  @Post('/envolvido')
  runEnvolvidoScript() {
    const success = false;
    this.envolvidoService.runScript();
    return success;
  }
}
