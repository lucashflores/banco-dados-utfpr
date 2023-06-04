import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AutoridadeEnvolvidaService } from './services/autoridade-envolvida.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(AutoridadeEnvolvidaService)
    private readonly autoridadeEnvolvidaService: AutoridadeEnvolvidaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/autoridade-envolvida')
  runScript() {
    const success = false;
    this.autoridadeEnvolvidaService.runScript();
    return success;
  }
}
