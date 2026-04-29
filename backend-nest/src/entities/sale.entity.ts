import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne
} from "typeorm";

import { SaleItem } from "./sale-item.entity";

@Entity("sales")
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  paymentMethod!: "cash" | "card" | "transfer";

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number;

  @OneToMany(() => SaleItem, (item) => item.sale, {
    cascade: true,
  })
  items!: SaleItem[];

  @CreateDateColumn()
  createdAt!: Date;
}
