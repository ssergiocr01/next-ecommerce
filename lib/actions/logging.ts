import { prisma } from "@/lib/prisma";

export async function createLog(data: {
  action: "CREATE" | "UPDATE" | "DELETE" | "VIEW";
  entity: "CATEGORY" | "PRODUCT" | "AUTH";
  entityId?: string;
  entityName?: string;
  details?: string;
}) {
  try {
    // Nota: Aquí podrías obtener el usuario de la sesión si usas cookies/lucia-auth
    await prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        entityName: data.entityName,
        details: data.details,
      },
    });
  } catch (error) {
    console.error("Error al guardar en bitácora:", error);
  }
}
