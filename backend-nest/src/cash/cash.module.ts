import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CashController } from "./cash.controller";
import { CashService } from "./cash.service";
import { CashRegister } from "../entities/cash-register.entity";
import { Sale } from "../entities/sale.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CashRegister, // ✅ tabla de corte de caja
      Sale,         // ✅ necesitamos ventas para calcular el corte
    ]),
  ],
  controllers: [CashController],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule {}
