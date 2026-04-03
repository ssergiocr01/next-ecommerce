# 🛒 DbEcommerce - Next.js & Prisma Professional System

Sistema de comercio electrónico de alto rendimiento construido con el **App Router** de Next.js, diseñado con una arquitectura escalable y profesional.

## 🚀 Tecnologías Principales

*   **Framework:** [Next.js 14/15 (App Router)](https://nextjs.org)
*   **Base de Datos:** [PostgreSQL](https://postgresql.org) (Dockerized)
*   **ORM:** [Prisma 5.21.0](https://prisma.io) (Configuración estable para entornos productivos)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com)
*   **Iconos:** [Lucide React](https://lucide.dev)
*   **Lenguaje:** [TypeScript](https://typescript.org)

## 📂 Estructura de Carpetas (Arquitectura)

El proyecto utiliza **Route Groups** para separar las experiencias de usuario sin afectar la limpieza de las URLs:

*   `(dashboard)`: Panel administrativo con Sidebar, Navbar y Footer persistentes.
*   `(auth)`: Páginas de acceso (Login/Register) con layout independiente y limpio.
*   `app/components`: Componentes globales reutilizables.
*   `prisma`: Esquemas y migraciones de la base de datos.

## 🛠️ Configuración del Entorno

### 1. Requisitos Previos
*   Node.js (LTS recomendado)
*   Docker Desktop (Para PostgreSQL)

### 2. Instalación de Dependencias
```bash
npm install
