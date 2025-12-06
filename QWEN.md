# Qwen Code Configuration for VLOCKSTER

## Descripción
Este archivo contiene la configuración específica para Qwen Code, el asistente de desarrollo encargado de implementar las funcionalidades del proyecto VLOCKSTER.

## Contexto del Proyecto
- **Nombre**: VLOCKSTER
- **Propósito**: Plataforma de streaming y crowdfunding para cine independiente
- **Tecnologías**: Next.js, TypeScript, Tailwind CSS, Supabase, Framer Motion
- **Enfoque**: Cine independiente, documentales, películas de autor

## Roles y Responsabilidades
- **Qwen Code (Asistente Principal)**: Implementación de funcionalidades, integración frontend-backend, DevOps
- **Serena**: Coordinación de tareas y validación de implementaciones
- **Taskmaster**: Gestión de sprints y seguimiento de objetivos
- **BMAD MCP**: Framework de automatización y control de calidad

## Patrones de Desarrollo
- **Type Safety**: 100% sin `as any`, uso de tipos de Supabase
- **Structured Logging**: Sistema de logging con ErrorId y contexto
- **Accessibility**: Cumplimiento WCAG 2.1 AA con ARIA labels
- **Test Coverage**: Mínimo 80% de cobertura en pruebas
- **Performance**: Optimización de queries y bundle size

## Convenciones de Código
- Uso de componentes reutilizables
- Enfoque en animaciones suaves con Framer Motion
- Optimización de carga de imágenes con Next.js Image
- Estructura de carpetas basada en app router de Next.js

## Integraciones
- Supabase para base de datos y autenticación
- Cloudflare Stream para hosting de videos
- PayPal para pagos de crowdfunding
- Sistema de recomendaciones AI

## Sprint Actual: Integración de Posters
- Componente PosterGallery.tsx para mostrar posters
- API endpoint /api/posters para gestión de posters
- Página /app/items/page.tsx como galería principal
- Procesos DevOps y CI/CD configurados

## Quality Gates
- Test coverage >80%
- Type safety 0 errores
- Performance <10% regresión
- Accesibilidad WCAG 2.1 AA