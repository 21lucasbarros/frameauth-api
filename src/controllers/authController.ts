import { Request, Response } from "express";
import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { name, email, password } = userSchema.parse(req.body);

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    // Criar novo usuário
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "sua-chave-secreta",
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: error.errors,
      });
    }
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Verificar senha
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "sua-chave-secreta",
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: error.errors,
      });
    }
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
