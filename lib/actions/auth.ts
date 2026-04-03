"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Definición de tipo para las respuestas de las acciones
export type ActionResponse = {
  error?: string;
  success?: boolean;
} | null;

/**
 * REGISTRO DE USUARIOS
 */
export async function registerAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "El correo ya está registrado" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN", // Cambiar a "USER" según lógica de negocio
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error en Registro:", error);
    return { error: "Error al crear la cuenta" };
  }
}

/**
 * INICIO DE SESIÓN
 * Modificado para guardar un objeto JSON en la cookie (ID + ROLE)
 */
export async function loginAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Credenciales inválidas" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Credenciales inválidas" };

    // ✅ ESTRUCTURA PARA EL MIDDLEWARE: Guardamos ID y ROL
    const sessionData = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Crear sesión con Cookies (Next.js 15 requiere await)
    const cookieStore = await cookies();
    cookieStore.set("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return { success: true };
  } catch (error) {
    console.error("Error en Login:", error);
    return { error: "Error de servidor al intentar ingresar" };
  }
}

/**
 * OBTENER USUARIO AUTENTICADO (Para Navbar/Layouts)
 * Adaptado para parsear el JSON de la cookie
 */
export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get("session")?.value;

    if (!sessionValue) return null;

    // Parseamos el contenido de la cookie
    const sessionData = JSON.parse(sessionValue);

    const user = await prisma.user.findUnique({
      where: { id: sessionData.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * CAMBIO DE CONTRASEÑA
 */
export async function changePasswordAction(prevState: any, formData: FormData): Promise<ActionResponse> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "Las nuevas contraseñas no coinciden" };
  }

  try {
    const userAuth = await getAuthUser();
    if (!userAuth) return { error: "No autorizado" };

    const user = await prisma.user.findUnique({ where: { email: userAuth.email } });
    if (!user) return { error: "Usuario no encontrado" };

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { error: "La contraseña actual es incorrecta" };

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Error en Cambio de Password:", error);
    return { error: "Error al actualizar la contraseña" };
  }
}

/**
 * CERRAR SESIÓN
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
