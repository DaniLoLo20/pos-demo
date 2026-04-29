import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  sku!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  purchasePrice!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  salePrice!: number;

  @Column("int")
  stock!: number;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}