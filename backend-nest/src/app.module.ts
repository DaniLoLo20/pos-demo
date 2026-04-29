import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { SalesModule } from "./sales/sales.module";
import { CashModule } from "./cash/cash.module";
import { UsersModule } from "./users/users.module";
import { SeedModule } from "./seed/seed.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgres",
      port: 5432,
      username: "admin",
      password: "admin",
      database: "login_db",
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule, 
    ProductsModule,
    SalesModule,
    CashModule,
    UsersModule,
    SeedModule
  ]
})
export class AppModule {}
