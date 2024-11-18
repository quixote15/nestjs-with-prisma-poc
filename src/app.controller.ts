import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/shifts/available/:workerId')
 async  getHello(@Param('workerId') workerId: string) {
   
    const shifts = await this.appService.getAvailableShifts(Number(workerId))
    return shifts
  }
}
