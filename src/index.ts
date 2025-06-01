import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bem-vindo(a) à API FrameAuth!");
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta: ${PORT}`);
});
