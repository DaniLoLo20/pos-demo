import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
} from "@nestjs/common";

import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";

@Controller("sales")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.createSale(dto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get("reports")
getReport() {
  return this.salesService.getSalesReport();
}

}