# Frontend - Sistema de Reservas de Citas

## 📋 Descripción

Frontend de un sistema profesional de reservas de citas desarrollado con **Next.js 14**, **TypeScript** y **Tailwind CSS**. La aplicación permite a los usuarios reservar citas con asesores especializados a través de una interfaz intuitiva y moderna.

## 🚀 Características Principales

### Sistema de Reservas

- **Sistema de Reservas Multi-Paso**: Proceso guiado de 4 pasos (Asesor → Horario → Formulario → Confirmación)
- **Selección de Asesores**: Catálogo de profesionales especializados
- **Gestión de Horarios**: Visualización y selección de disponibilidad en tiempo real
- **Formularios Inteligentes**: Validación con React Hook Form y Zod
- **Gestión de Reservas del Cliente**: Búsqueda de reservas por email

### Panel de Administración

- **Dashboard Administrativo**: Estadísticas en tiempo real del sistema
- **Gestión Completa de Reservas**: Visualización, filtrado y gestión de todas las reservas
- **Sistema de Autenticación**: Login y registro de administradores
- **Logs de Email**: Monitoreo del sistema de notificaciones por email
- **Gestión de Estados**: Cambio de estado de reservas (confirmar, cancelar, completar)
- **Reenvío de Emails**: Funcionalidad para reenviar emails de confirmación

### Características Técnicas

- **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **UI/UX Moderna**: Componentes personalizados con Tailwind CSS
- **Autenticación Segura**: Sistema de tokens JWT para administradores
- **Validación Robusta**: Validación tanto en frontend como backend
- **Manejo de Errores**: Sistema completo de manejo de errores y notificaciones

## 🛠️ Tecnologías Utilizadas

### Core Framework

- **Next.js 14.2.5** - Framework React con App Router
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático

### Styling & UI

- **Tailwind CSS 3.4.1** - Framework de CSS utilitario
- **Lucide React** - Iconografía moderna
- **Componentes UI Personalizados** - Sistema de diseño consistente

### Formularios y Validación

- **React Hook Form 7.52.1** - Gestión de formularios
- **Zod 3.23.8** - Validación de esquemas
- **@hookform/resolvers** - Integración de validadores

### HTTP y Estado

- **Axios 1.7.7** - Cliente HTTP
- **date-fns 4.1.0** - Manipulación de fechas

### Utilidades

- **clsx** - Utilidad para clases CSS condicionales
- **tailwind-merge** - Fusión inteligente de clases Tailwind

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── globals.css         # Estilos globales
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Página principal (sistema de reservas)
│   │   ├── my-bookings/        # Página de reservas del usuario
│   │   └── admin/              # Panel de administración
│   │       ├── layout.tsx      # Layout del panel admin
│   │       ├── page.tsx        # Dashboard principal
│   │       ├── login/          # Autenticación de administradores
│   │       │   └── page.tsx
│   │       ├── bookings/       # Gestión de reservas
│   │       │   └── page.tsx
│   │       └── email-logs/     # Logs de emails
│   │           └── page.tsx
│   ├── components/             # Componentes reutilizables
│   │   ├── booking/           # Componentes específicos de reservas
│   │   │   ├── AdvisorCard.tsx
│   │   │   ├── AdvisorSelection.tsx
│   │   │   └── TimeSlotSelector.tsx
│   │   ├── forms/             # Componentes de formularios
│   │   │   └── BookingForm.tsx
│   │   └── ui/                # Componentes base de UI
│   │       ├── Alert.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Calendar.tsx
│   │       ├── Card.tsx
│   │       ├── DateRangePicker.tsx
│   │       ├── Input.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/                   # Utilidades y configuración
│   │   ├── api.ts             # Servicio de API completo
│   │   └── utils.ts           # Utilidades generales
│   └── types/                 # Definiciones de TypeScript
│       └── index.ts           # Interfaces y tipos
├── public/                    # Archivos estáticos
├── package.json               # Dependencias y scripts
├── tailwind.config.js         # Configuración de Tailwind
├── next.config.js             # Configuración de Next.js
└── tsconfig.json              # Configuración de TypeScript
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm, yarn, pnpm o bun

### 1. Instalación de Dependencias

```bash
# Usando npm
npm install

# Usando yarn
yarn install

# Usando pnpm
pnpm install

# Usando bun
bun install
```

### 2. Configuración de Variables de Entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp env.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Ejecutar en Desarrollo

```bash
# Usando npm
npm run dev

# Usando yarn
yarn dev

# Usando pnpm
pnpm dev

# Usando bun
bun dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 4. Acceso al Panel de Administración

Para acceder al panel de administración, visita:

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

#### Credenciales de Demo

```
Email: admin@bookingapp.com
Contraseña: admin123
```

#### Funcionalidades del Panel Admin

- Dashboard con estadísticas en tiempo real
- Gestión completa de reservas
- Logs de emails y sistema de notificaciones
- Cambio de estados de reservas
- Reenvío de emails de confirmación

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar código
```

## 🎯 Funcionalidades Detalladas

### 1. Sistema de Reservas Multi-Paso

#### Paso 1: Selección de Asesor

- Visualización de asesores disponibles
- Información detallada de cada profesional
- Filtros por especialidad (futuro)

#### Paso 2: Selección de Horario

- Calendario interactivo
- Visualización de disponibilidad en tiempo real
- Selección de fecha y hora específica

#### Paso 3: Formulario de Reserva

- Datos del cliente (nombre, email)
- Validación en tiempo real
- Confirmación de detalles de la reserva

#### Paso 4: Confirmación

- Resumen de la reserva
- Número de confirmación
- Opciones para nueva reserva o ver reservas existentes

### 2. Gestión de Reservas del Cliente

- **Ver Mis Reservas**: Página dedicada para consultar reservas existentes
- **Búsqueda por Email**: Sistema de búsqueda de reservas por dirección de email
- **Estados de Reserva**: Confirmada, Cancelada, Completada

### 3. Panel de Administración

#### Dashboard Principal

- **Estadísticas en Tiempo Real**: Métricas de reservas, asesores y disponibilidad
- **Reservas Recientes**: Visualización de las últimas 5 reservas
- **Sistema de Emails**: Monitoreo de emails enviados, pendientes y fallidos
- **Acciones Rápidas**: Navegación directa a las secciones principales

#### Gestión de Reservas

- **Lista Completa**: Visualización de todas las reservas del sistema
- **Filtros Avanzados**: Por fecha, asesor, estado, cliente
- **Búsqueda**: Sistema de búsqueda por nombre de cliente o email
- **Gestión de Estados**: Cambio de estado de reservas (confirmar, cancelar, completar)
- **Reenvío de Emails**: Funcionalidad para reenviar emails de confirmación
- **Eliminación**: Opción para cancelar/eliminar reservas

#### Sistema de Autenticación

- **Login de Administradores**: Sistema seguro de autenticación
- **Registro de Nuevos Admins**: Creación de cuentas administrativas
- **Protección de Rutas**: Middleware de autenticación para rutas administrativas
- **Gestión de Tokens**: Sistema JWT para sesiones seguras

#### Logs de Email

- **Historial Completo**: Registro de todos los emails enviados
- **Filtros por Tipo**: Confirmación, recordatorio, cancelación
- **Filtros por Estado**: Enviado, pendiente, fallido
- **Reenvío Individual**: Capacidad de reenviar emails específicos

### 4. Componentes UI Reutilizables

#### Componentes Base

- **Alert**: Notificaciones y mensajes de estado
- **Badge**: Etiquetas de estado con variantes (success, warning, error, info)
- **Button**: Botones con variantes (primary, outline, ghost) y estados
- **Card**: Contenedores de contenido con header y content
- **Input**: Campos de formulario con validación y estados
- **LoadingSpinner**: Indicadores de carga con diferentes tamaños

#### Componentes Especializados

- **Calendar**: Selector de fechas interactivo
- **DateRangePicker**: Selector de rangos de fechas
- **AdvisorCard**: Tarjeta de presentación de asesores
- **AdvisorSelection**: Componente de selección de asesores
- **TimeSlotSelector**: Selector de horarios disponibles
- **BookingForm**: Formulario completo de reserva con validación

## 🔧 Configuración Avanzada

### Tailwind CSS

El proyecto utiliza un sistema de diseño personalizado con variables CSS:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... más variables */
}
```

### TypeScript

Configuración estricta de TypeScript con:

- Strict mode habilitado
- Path mapping para imports absolutos
- Tipos específicos para la API

### Next.js

- App Router (nuevo sistema de routing)
- Server Components por defecto
- Client Components cuando es necesario
- Optimización automática de imágenes

## 🌐 Integración con Backend

### API Service (`lib/api.ts`)

Servicio centralizado para comunicación con el backend:

```typescript
// Ejemplo de uso
import { apiService } from "@/lib/api";

// Obtener asesores
const advisors = await apiService.getAdvisors();

// Crear reserva
const booking = await apiService.createBooking(formData);
```

### Endpoints Principales

#### Reservas (Públicos)

- `GET /bookings/advisors` - Lista de asesores disponibles
- `GET /bookings/availability` - Disponibilidad de horarios por asesor
- `POST /bookings` - Crear nueva reserva
- `GET /bookings/my-bookings` - Reservas del cliente por email

#### Autenticación de Administradores

- `POST /auth/login` - Login de administrador
- `POST /auth/register` - Registro de nuevo administrador
- `GET /auth/me` - Verificar token de administrador

#### Panel de Administración

- `GET /admin/stats` - Estadísticas del dashboard
- `GET /admin/bookings` - Lista completa de reservas
- `PUT /admin/bookings/:id/status` - Cambiar estado de reserva
- `DELETE /admin/bookings/:id` - Cancelar/eliminar reserva
- `POST /admin/bookings/:id/resend-email` - Reenviar email de confirmación
- `GET /admin/email-logs` - Logs de emails enviados

## 🎨 Sistema de Diseño

### Colores

- **Primary**: Azul (#3B82F6)
- **Secondary**: Púrpura (#8B5CF6)
- **Success**: Verde (#10B981)
- **Warning**: Amarillo (#F59E0B)
- **Error**: Rojo (#EF4444)

### Tipografía

- **Font Family**: Inter (optimizada por Next.js)
- **Tamaños**: Responsive con escala móvil-first

### Espaciado

- **Grid System**: 12 columnas con breakpoints
- **Spacing**: Escala de 4px (0.25rem, 0.5rem, 1rem, etc.)

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Optimizaciones Móviles

- Touch-friendly interfaces
- Gestos de navegación
- Optimización de formularios para móvil

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
```

## 🧪 Testing (Futuro)

```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Ejecutar tests
npm run test
```

## 📊 Performance

### Optimizaciones Implementadas

- **Code Splitting**: Automático con Next.js
- **Image Optimization**: Componente Image de Next.js
- **Bundle Analysis**: `npm run build` incluye análisis
- **Lazy Loading**: Componentes cargados bajo demanda

### Métricas Objetivo

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## 🔍 Debugging

### Herramientas de Desarrollo

- **React Developer Tools**
- **Next.js DevTools**
- **Tailwind CSS IntelliSense**

### Logs y Monitoreo

```typescript
// Ejemplo de logging
console.log("API Response:", response.data);
```

## 🤝 Contribución

### Estándares de Código

- **ESLint**: Configuración Next.js
- **Prettier**: Formateo automático
- **Conventional Commits**: Mensajes de commit estandarizados

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de React Hook Form](https://react-hook-form.com/)
- [Documentación de Zod](https://zod.dev/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ usando Next.js, TypeScript y Tailwind CSS**
