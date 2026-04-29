import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { AppDataSource } from "../data.source";

const router = Router();
const userRepo = AppDataSource.getRepository(User);

const JWT_SECRET = "secreto_super_simple";

// ✅ SOLO ADMIN
router.get(
  "/admin",
  authMiddleware,
  requireRole(["admin"]),
  (_req, res) => {
    res.json({
      message: "Solo admin 👑",
    });
  }
);

// ✅ ADMIN + CLIENTE
router.get(
  "/dashboard",
  authMiddleware,
  requireRole(["admin", "cliente"]),
  (_req, res) => {
    res.json({
      message: "Dashboard compartido ✅",
    });
  }
);

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { email, password, rol } = req.body;

  if (!email || !password || !rol) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const existingUser = await userRepo.findOneBy({ email });

  if (existingUser) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = userRepo.create({
    email,
    password: hashedPassword,
    rol,
  });

  await userRepo.save(user);

  res.json({ message: "Usuario creado correctamente ✅" });
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepo.findOneBy({ email });

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// ✅ PERFIL (TOKEN)
router.get("/perfil", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: "Perfil obtenido ✅",
    user: req.user,
  });
});

export default router;
