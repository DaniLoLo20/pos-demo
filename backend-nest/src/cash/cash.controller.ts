import { Controller, Post, Body, UseGuards, Get  } from "@nestjs/common";
import { CashService } from "./cash.service";
import { OpenCashDto } from "./dto/open-cash.dto";
import { CloseCashDto } from "./dto/close-cash.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("cash")
@UseGuards(JwtAuthGuard)
export class CashController {
  constructor(private readonly cashService: CashService) {}

  @Post("open")
  open(@Body() dto: OpenCashDto) {
    return this.cashService.openCash(dto.openingAmount);
  }

  @Post("close")
  close(@Body() dto: CloseCashDto) {
    return this.cashService.closeCash(dto.closingAmount);
  }
@Get()
getHistory() {
  return this.cashService.getHistory();
}
  
}