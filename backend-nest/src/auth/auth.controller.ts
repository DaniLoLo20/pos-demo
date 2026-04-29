import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(
    @Body("email") email: string,
    @Body("password") password: string,
    @Body("rol") rol: string
  ) {
    return this.authService.register(email, password, rol);
  }

  @Post("login")
  login(
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    return this.authService.login(email, password);
  }

  @Get("perfil")
  @UseGuards(JwtAuthGuard)
  perfil(@Req() req: Request) {
    return {
      message: "Perfil obtenido ✅",
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("admin")
  admin() {
    return { message: "Solo admin 👑" };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "cliente")
  @Get("dashboard")
  dashboard() {
    return { message: "Dashboard compartido ✅" };
  }
}