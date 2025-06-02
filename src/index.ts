import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

// Conectar ao MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://lucas235182:21022003@cluster0.yrdjb.mongodb.net/FrameAuth?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rotas
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Bem-vindo(a) à API FrameAuth!");
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta: ${PORT}`);
});
