import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Sale } from "../entities/sale.entity";
import { SaleItem } from "../entities/sale-item.entity";
import { Product } from "../entities/product.entity";
import { CreateSaleDto } from "./dto/create-sale.dto";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(SaleItem)
    private saleItemRepo: Repository<SaleItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}

  async createSale(dto: CreateSaleDto) {
    let total = 0;
    const saleItems: SaleItem[] = [];

    for (const item of dto.items) {
      const product = await this.productRepo.findOneBy({
        id: item.productId,
      });

      if (!product || !product.active) {
        throw new BadRequestException("Producto inválido");
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${product.name}`
        );
      }

      const saleItem = this.saleItemRepo.create({
        product,
        quantity: item.quantity,
        price: product.salePrice,
      });

      total += product.salePrice * item.quantity;
      saleItems.push(saleItem);

      // Descontar inventario
      product.stock -= item.quantity;
      await this.productRepo.save(product);
    }

    const sale = this.saleRepo.create({
      paymentMethod: dto.paymentMethod,
      total,
      items: saleItems,
    });

    return this.saleRepo.save(sale);
  }
async getSalesReport() {
  const sales = await this.saleRepo.find({
    relations: ["items", "items.product"],
  });

  let totalSales = 0;
  let totalProfit = 0;
  let totalItems = 0;

  sales.forEach((sale) => {
    totalSales += Number(sale.total);

    sale.items.forEach((item) => {
      const cost = Number(item.product.purchasePrice);
      const price = Number(item.price);

      totalItems += item.quantity;
      totalProfit += (price - cost) * item.quantity;
    });
  });

  return {
    totalSales,
    totalProfit,
    totalItems,
    salesCount: sales.length,
    sales,
  };
}

  async findAll() {
    return this.saleRepo.find({
      relations: ["items", "items.product"],
      order: { createdAt: "DESC" },
    });
  }
}