"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createLog } from "./logging";
import { ActionResponse } from "./auth";

// --- CREAR PRODUCTO ---
export async function createProduct(data: any): Promise<ActionResponse> {
  try {
    const product = await prisma.product.create({ data });
    
    await createLog({
      action: "CREATE",
      entity: "PRODUCT",
      entityId: product.id,
      entityName: product.name,
      details: `Stock inicial: ${product.stock}`
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al crear el producto" };
  }
}

// --- ELIMINAR PRODUCTO ---
export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    // 1. Buscamos el producto antes de borrar para tener su nombre para el log
    const product = await prisma.product.findUnique({ where: { id } });

    // ✅ SOLUCIÓN AL ERROR: Verificamos que el producto exista
    if (!product) {
      return { success: false, error: "El producto no existe o ya fue eliminado." };
    }

    // 2. Ejecutamos la eliminación
    await prisma.product.delete({ where: { id } });

    // 3. Registro en bitácora (Ahora TS sabe que 'product' no es null)
    await createLog({
      action: "DELETE",
      entity: "PRODUCT",
      entityId: id,
      entityName: product.name,
      details: "Producto eliminado desde el panel administrativo."
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el producto." };
  }
}

// --- ACTUALIZAR PRODUCTO ---
export async function updateProduct(
  id: string, 
  data: { 
    name: string; 
    price: number; 
    stock: number; 
    description?: string; 
    categoryId: string; 
    images: string[] 
  }
): Promise<ActionResponse> {
  try {
    // 1. Obtener el estado actual para comparar en el log
    const oldProduct = await prisma.product.findUnique({ 
      where: { id } 
    });

    if (!oldProduct) {
      return { success: false, error: "Producto no encontrado." };
    }

    // 2. Ejecutar la actualización en Prisma
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        images: data.images,
      }
    });

    // 3. Lógica detallada para la Bitácora (AuditLog)
    let details = "Actualización de detalles generales.";
    
    if (oldProduct.name !== updatedProduct.name) {
      details = `Nombre: "${oldProduct.name}" -> "${updatedProduct.name}"`;
    } else if (Number(oldProduct.price) !== data.price) {
      details = `Precio ajustado: ${oldProduct.price} -> ${data.price}`;
    } else if (oldProduct.stock !== data.stock) {
      details = `Stock modificado: ${oldProduct.stock} -> ${data.stock} unidades`;
    }

    await createLog({
      action: "UPDATE",
      entity: "PRODUCT",
      entityId: id,
      entityName: updatedProduct.name,
      details: details
    });

    // 4. Refrescar la caché de la tabla de productos
    revalidatePath("/products");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error al actualizar producto:", error);
    
    if (error.code === 'P2002') {
      return { success: false, error: "Ya existe otro producto con ese nombre o slug." };
    }
    
    return { success: false, error: "Error interno al intentar actualizar el producto." };
  }
}
