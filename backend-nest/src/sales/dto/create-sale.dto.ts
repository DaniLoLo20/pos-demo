export class CreateSaleDto {
  paymentMethod!: "cash" | "card" | "transfer";

  items!: {
    productId: number;
    quantity: number;
  }[];
}
