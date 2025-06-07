import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

// Rota de registro já existente
router.post("/register", register);

// Rota de login com validação de email e senha usando Zod
router.post("/login", login);

export default router;
