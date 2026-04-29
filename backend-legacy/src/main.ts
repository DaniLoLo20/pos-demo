import express from "express";
import authRoutes from "./routes/auth.routes";
import { AppDataSource } from "./data.source";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});


AppDataSource.initialize()
  .then(() => {
    console.log("✅ TypeORM conectado con TypeScript");

    app.get("/", (_req, res) => {
      res.send("Backend TS vivo ✅");
    });

    // 👇 RUTAS
    app.use("/auth", authRoutes);

    app.listen(3000, () => {
      console.log("Backend escuchando en puerto 3000");
    });
  })
  .catch((err: unknown) => {
    console.error("❌ Error DB", err);
  });
