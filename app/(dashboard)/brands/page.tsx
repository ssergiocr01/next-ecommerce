import { prisma } from "@/lib/prisma"
import { BrandClient } from "./brand-client" // Asegúrate de que la ruta sea correcta

export default async function BrandsPage() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: { select: { products: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // IMPORTANTE: Solo pasamos la data, no importamos 'columns' aquí.
    return <BrandClient initialData={brands} />;
  } catch (error) {
    console.error("Error cargando marcas:", error);
    return <div>Error al cargar los datos.</div>;
  }
}
