import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne
} from "typeorm";

import { Product } from "./product.entity";
import { Sale } from "./sale.entity";

@Entity("sale_items")
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale, (sale) => sale.items)
  sale!: Sale;

  @ManyToOne(() => Product)
  product!: Product;

  @Column("int")
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;
}