import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("cash_registers")
export class CashRegister {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  openingAmount!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  closingAmount!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  totalCash!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  totalCard!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  totalTransfer!: number;

  @Column({ default: true })
  isOpen!: boolean;

  @CreateDateColumn()
  openedAt!: Date;

  @Column({ nullable: true })
  closedAt!: Date;
}
