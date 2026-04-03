"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Credenciales inválidas" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Credenciales inválidas" };

    // Configuramos la cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { success: true }; // Retornamos éxito al cliente
  } catch (error) {
    return { error: "Error de servidor" };
  }
}



export async function registerAction(prevState: any, formData: FormData) {
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
        role: "ADMIN",
      },
    });

    // No pongas el redirect aquí adentro
  } catch (error) {
    console.error(error);
    return { error: "Error al crear la cuenta" };
  }

  // EL REDIRECT DEBE IR AQUÍ (Fuera del catch)
  redirect("/login");
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: { name: true, email: true, role: true } // Solo traemos lo necesario
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function changePasswordAction(prevState: any, formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "Las nuevas contraseñas no coinciden" };
  }

  try {
    const userAuth = await getAuthUser(); // Usamos la función que ya tenemos
    if (!userAuth?.email) return { error: "No autorizado" };

    // Buscamos al usuario completo para obtener el password hash
    const user = await prisma.user.findUnique({ where: { email: userAuth.email } });
    if (!user) return { error: "Usuario no encontrado" };

    // Validar contraseña actual
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { error: "La contraseña actual es incorrecta" };

    // Encriptar la nueva
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar la contraseña" };
  }
}


export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}