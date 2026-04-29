import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

import * as bcrypt from "bcryptjs";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findAll() {
    return this.userRepo.find({
      select: ["id", "email", "rol", "createdAt"],
    });
  }

  async create(dto: CreateUserDto) {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException("El usuario ya existe");
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hash,
      rol: dto.rol,
    });

    return this.userRepo.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new BadRequestException("Usuario no encontrado");

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.email) user.email = dto.email;
    if (dto.rol) user.rol = dto.rol;

    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new BadRequestException("Usuario no encontrado");

    await this.userRepo.remove(user);
    return { success: true };
  }
}
