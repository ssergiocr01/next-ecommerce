"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "./auth";
import { createLog } from "./logging"; // ✅ Importación única, sin conflicto local

// --- CREAR CATEGORÍA ---
export async function createCategory(data: { 
  name: string; 
  slug: string; 
  description?: string; 
  image?: string 
}): Promise<ActionResponse> {
  try {
    const category = await prisma.category.create({ data });
    
    // Registro en bitácora
    await createLog({
      action: "CREATE",
      entity: "CATEGORY",
      entityId: category.id,
      entityName: category.name,
      details: `Categoría creada: ${category.name} (Slug: ${category.slug})`
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "El nombre o slug ya está en uso." };
    }
    return { success: false, error: "Error al crear la categoría." };
  }
}

// --- ACTUALIZAR CATEGORÍA ---
export async function updateCategory(
  id: string, 
  data: { name: string; slug: string; description?: string; image?: string }
): Promise<ActionResponse> {
  try {
    // 1. Obtener estado anterior para el log
    const oldCategory = await prisma.category.findUnique({ where: { id } });

    const updatedCategory = await prisma.category.update({
      where: { id },
      data
    });

    // Registro en bitácora comparando cambios
    const detailMsg = oldCategory?.name !== updatedCategory.name 
      ? `Cambió nombre: "${oldCategory?.name}" -> "${updatedCategory.name}"`
      : "Se actualizaron detalles (imagen/descripción)";

    await createLog({
      action: "UPDATE",
      entity: "CATEGORY",
      entityId: id,
      entityName: updatedCategory.name,
      details: detailMsg
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar los datos." };
  }
}

// --- ELIMINAR CATEGORÍA ---
export async function deleteCategory(id: string): Promise<ActionResponse> {
  try {
    // 1. Validación de integridad
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return { 
        success: false, 
        error: `No se puede eliminar: tiene ${productsCount} productos asociados.` 
      };
    }

    // 2. Ejecutar eliminación
    const deletedCategory = await prisma.category.delete({ where: { id } });

    // 3. Registro en bitácora
    await createLog({
      action: "DELETE",
      entity: "CATEGORY",
      entityId: id,
      entityName: deletedCategory.name,
      details: `Categoría "${deletedCategory.name}" eliminada permanentemente.`
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar la categoría." };
  }
}
