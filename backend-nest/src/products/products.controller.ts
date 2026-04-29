import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("products")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ Crear producto (admin)
  @Post()
  @Roles("admin")
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // ✅ Listar / buscar (admin y POS)
  @Get()
  findAll(@Query("search") search?: string) {
    return this.productsService.findAll(search);
  }

  // ✅ Ver producto
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(+id);
  }

  // ✅ Editar producto (admin)
  @Patch(":id")
  @Roles("admin")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productsService.update(+id, dto);
  }

  // ✅ Desactivar producto (admin)
  @Patch(":id/deactivate")
  @Roles("admin")
  deactivate(@Param("id") id: string) {
    return this.productsService.deactivate(+id);
  }
}
