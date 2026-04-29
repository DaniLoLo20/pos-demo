import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { CashRegister } from "../entities/cash-register.entity";
import { Sale } from "../entities/sale.entity";
@Injectable()
export class CashService {
  constructor(
    @InjectRepository(CashRegister)
    private cashRepo: Repository<CashRegister>,

    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>
  ) {}

  async openCash(openingAmount: number) {
    const alreadyOpen = await this.cashRepo.findOne({
      where: { isOpen: true },
    });

    if (alreadyOpen) {
      throw new BadRequestException("Ya existe una caja abierta");
    }

    return this.cashRepo.save({
      openingAmount,
      isOpen: true,
    });
  }

  async getHistory() {
    return this.cashRepo.find({
      order: { openedAt: "DESC" },
    });
  }

  async closeCash(closingAmount: number) {
    const cash = await this.cashRepo.findOne({
      where: { isOpen: true },
    });

    if (!cash) {
      throw new BadRequestException("No hay caja abierta");
    }

    const sales = await this.saleRepo.find({
      where: {
        createdAt: Between(cash.openedAt, new Date()),
      },
    });

    let totalCash = 0;
    let totalCard = 0;
    let totalTransfer = 0;

    sales.forEach((s) => {
      if (s.paymentMethod === "cash") totalCash += Number(s.total);
      if (s.paymentMethod === "card") totalCard += Number(s.total);
      if (s.paymentMethod === "transfer") totalTransfer += Number(s.total);
    });

    cash.totalCash = totalCash;
    cash.totalCard = totalCard;
    cash.totalTransfer = totalTransfer;
    cash.closingAmount = closingAmount;
    cash.closedAt = new Date();
    cash.isOpen = false;

    return this.cashRepo.save(cash);
  }
}