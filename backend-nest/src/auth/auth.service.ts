import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string, rol: string) {
    const exists = await this.userRepo.findOneBy({ email });

    if (exists) {
      throw new UnauthorizedException("El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      rol,
    });

    await this.userRepo.save(user);

    return { message: "Usuario creado correctamente ✅" };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}