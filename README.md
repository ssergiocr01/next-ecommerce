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

El proyecto utiliza **Route Groups** para separar las experiencias de usuario de forma lógica y profesional:

*   `app/(dashboard)`: Panel administrativo con Sidebar, Navbar y Footer persistentes.
*   `app/(auth)`: Módulo de acceso (Login/Register/Recovery) con layout independiente.
*   `app/components`: Componentes globales reutilizables (Sidebar, Navbar, UserMenu).
*   `lib/actions`: Lógica de servidor (Server Actions) para autenticación y gestión de datos.
*   `prisma`: Esquemas y migraciones de la base de datos PostgreSQL.

## 📝 Características Implementadas

### 🔐 Seguridad y Autenticación
- [x] **Registro de Usuarios:** Encriptación de contraseñas con `bcryptjs`.
- [x] **Login Profesional:** Validación segura contra base de datos y manejo de errores con `useActionState`.
- [x] **Gestión de Sesiones:** Implementación de cookies seguras (`httpOnly`).
- [x] **Seguridad de Cuenta:** Cambio de contraseña desde el perfil y cierre de sesión funcional.
- [x] **Recuperación:** Interfaz de "Olvidé mi contraseña" preparada para tokens.

### 🖥️ Interfaz de Usuario (UI/UX)
- [x] **Dashboard Layout:** Diseño profesional con Sidebar dinámico y Navbar persistente.
- [x] **User Menu:** Menú desplegable interactivo para gestión de perfil y cierre de sesión.
- [x] **Diseño Premium:** Estética moderna usando Tailwind CSS, Lucide Icons y animaciones.

## 🛠️ Configuración del Entorno

### 1. Requisitos Previos
*   Node.js (LTS recomendado)
*   Docker Desktop (Para PostgreSQL)

### 2. Instalación de Dependencias
```bash
npm install
