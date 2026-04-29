import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "../entities/user.entity";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async onModuleInit(): Promise<void> {
    await this.createAdminUser();
  }

  private async createAdminUser(): Promise<void> {
    const email = "admin@test.com";

    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      this.logger.log("Seed: usuario admin ya existe, no se crea");
      return;
    }

    const passwordHash = await bcrypt.hash("123456", 10);

    const admin = this.userRepository.create({
      email,
      password: passwordHash,
      rol: "admin",
    });

    await this.userRepository.save(admin);

    this.logger.log(
      "Seed: usuario admin creado (admin@test.com / 123456)"
    );
  }
}