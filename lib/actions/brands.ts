"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createLog } from "./logging";
import { ActionResponse } from "./auth";

// --- CREAR MARCA ---
export async function createBrand(data: { name: string; slug: string; logo?: string }): Promise<ActionResponse> {
  try {
    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
      }
    });

    await createLog({
      action: "CREATE",
      entity: "AUTH", // Puedes ajustar el Enum en logging si prefieres uno específico para BRANDS
      entityId: brand.id,
      entityName: brand.name,
      details: `Marca creada: ${brand.name}`
    });

    revalidatePath("/brands");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "El nombre o slug de la marca ya existe." };
    }
    return { success: false, error: "Error al crear la marca." };
  }
}

// --- ACTUALIZAR MARCA ---
export async function updateBrand(id: string, data: { name: string; slug: string; logo?: string }): Promise<ActionResponse> {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data
    });

    await createLog({
      action: "UPDATE",
      entity: "AUTH",
      entityId: id,
      entityName: brand.name,
      details: `Se actualizaron los datos de la marca ${brand.name}`
    });

    revalidatePath("/brands");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar la marca." };
  }
}

// --- ELIMINAR MARCA ---
export async function deleteBrand(id: string): Promise<ActionResponse> {
  try {
    // 1. Verificar si tiene productos asociados (Integridad referencial)
    const productsCount = await prisma.product.count({ where: { brandId: id } });
    
    if (productsCount > 0) {
      return { 
        success: false, 
        error: `No se puede eliminar: Esta marca tiene ${productsCount} productos vinculados.` 
      };
    }

    const brand = await prisma.brand.delete({ where: { id } });

    await createLog({
      action: "DELETE",
      entity: "AUTH",
      entityId: id,
      entityName: brand.name,
      details: `Marca "${brand.name}" eliminada permanentemente.`
    });

    revalidatePath("/brands");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar la marca." };
  }
}
