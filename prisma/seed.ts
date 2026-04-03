import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando siembra de datos maestros...');

  // 1. Crear Marcas Líderes
  const brandsData = [
    { name: 'Nestlé', slug: 'nestle' },
    { name: 'Coca-Cola', slug: 'coca-cola' },
    { name: 'Unilever', slug: 'unilever' },
    { name: 'Procter & Gamble', slug: 'p-and-g' },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'Dos Pinos', slug: 'dos-pinos' },
    { name: 'Generic', slug: 'generic' } // Para productos sin marca específica
  ];

  const brands: any = {};
  for (const b of brandsData) {
    brands[b.slug] = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  // 2. Datos de Categorías con sus respectivos Productos
  const categoriesData = [
    { 
        name: 'Abarrotes y Despensa', slug: 'abarrotes-despensa', description: 'Básicos del hogar.',
        products: [
            { name: 'Arroz Integral 1kg', price: 2.50, stock: 100, brandSlug: 'generic' },
            { name: 'Cereal Fitness 400g', price: 5.20, stock: 40, brandSlug: 'nestle' }
        ]
    },
    { 
        name: 'Lácteos y Huevos', slug: 'lacteos-huevos', description: 'Frescura diaria.',
        products: [
            { name: 'Leche Entera 1L', price: 1.20, stock: 200, brandSlug: 'dos-pinos' },
            { name: 'Yogurt Griego Fresa', price: 1.80, stock: 60, brandSlug: 'dos-pinos' }
        ]
    },
    { 
        name: 'Bebidas y Licores', slug: 'bebidas-licores', description: 'Refrescos y más.',
        products: [
            { name: 'Coca Cola 2.5L', price: 2.80, stock: 150, brandSlug: 'coca-cola' },
            { name: 'Agua Dasani 600ml', price: 1.00, stock: 300, brandSlug: 'coca-cola' }
        ]
    },
    { 
        name: 'Limpieza del Hogar', slug: 'limpieza-hogar', description: 'Higiene garantizada.',
        products: [
            { name: 'Detergente Ariel 3L', price: 14.50, stock: 50, brandSlug: 'p-and-g' },
            { name: 'Jabón Dove 4 Pack', price: 6.20, stock: 90, brandSlug: 'unilever' }
        ]
    },
    { 
        name: 'Electrónica', slug: 'electronica', description: 'Tecnología avanzada.',
        products: [
            { name: 'Smart TV 50" 4K', price: 450.00, stock: 10, brandSlug: 'samsung' },
            { name: 'Galaxy Buds 2', price: 99.00, stock: 20, brandSlug: 'samsung' }
        ]
    }
  ];

  // 3. Ejecutar creación de Categorías y Productos vinculados
  for (const item of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: item.slug },
      update: {},
      create: { name: item.name, slug: item.slug, description: item.description },
    });

    for (const prod of item.products) {
      const productSlug = prod.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      await prisma.product.upsert({
        where: { slug: productSlug },
        update: {},
        create: {
          name: prod.name,
          slug: productSlug,
          price: prod.price,
          stock: prod.stock,
          categoryId: category.id,
          brandId: brands[prod.brandSlug].id, // ✅ Vinculación con Marca
          images: []
        }
      });
    }
  }

  console.log('✅ ¡Siembra completada con éxito! (Marcas + Categorías + Productos)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
