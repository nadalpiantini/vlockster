# Configuración CI/CD para VLOCKSTER

## Descripción
Este archivo define la configuración de integración continua y entrega continua para el proyecto VLOCKSTER, incluyendo los flujos para los sprints de desarrollo de posters.

## Pipeline de CI/CD

### Fase de Build
- `build`: Verifica que la aplicación se construya correctamente
- `type-check`: Ejecuta TypeScript para verificar seguridad de tipos
- `lint`: Valida el código con las reglas de ESLint
- `test`: Ejecuta las pruebas unitarias e integración

### Fase de Deploy
- `dev`: Despliegue automático a entorno de desarrollo para validación temprana
- `staging`: Despliegue automático a entorno de staging para pruebas de integración
- `prod`: Despliegue manual a producción tras aprobación

## Configuración específica para sprints de posters

### Sprint 001 - Integración de Posters
- Se activa cuando se modifican archivos relacionados con posters
- Requiere pasar todas las pruebas de integración
- Implementa validación de carga de imágenes y optimización

## Estrategia de ramas
- `main`: Rama principal protegida, solo se puede hacer merge con PR aprobado
- `develop`: Rama de desarrollo para integración de nuevas funcionalidades
- `feature/posters-*`: Ramas para features específicas de posters
- `hotfix/posters-*`: Ramas para fixes críticos

## Configuración de Quality Gates
- Test coverage: Mínimo 80%
- Security scan: Sin vulnerabilidades críticas
- Performance: No regresión superior al 10% en métricas clave
- Type safety: 0 errores de TypeScript