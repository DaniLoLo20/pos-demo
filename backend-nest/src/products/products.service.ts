import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  // ✅ Crear producto
  async create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  // ✅ Listar / buscar productos
  async findAll(search?: string) {
    if (search) {
      return this.productRepo.find({
        where: [
          { name: Like(`%${search}%`) },
          { sku: Like(`%${search}%`) },
        ],
        order: { createdAt: "DESC" },
      });
    }

    return this.productRepo.find({
      order: { createdAt: "DESC" },
    });
  }

  // ✅ Obtener uno
  async findOne(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException("Producto no encontrado");
    }
    return product;
  }

  // ✅ Actualizar
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  // ✅ Desactivar (soft delete)
  async deactivate(id: number) {
    const product = await this.findOne(id);
    product.active = false;
    return this.productRepo.save(product);
  }
}
