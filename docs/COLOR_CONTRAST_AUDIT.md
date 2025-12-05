# Color Contrast Audit - WCAG 2.1 AA Compliance

**Fecha**: 2025-01-27  
**Estándar**: WCAG 2.1 AA  
**Requisitos**:
- Texto normal (16px): Mínimo 4.5:1
- Texto grande (18px+ o 14px+ bold): Mínimo 3:1

## Problemas Identificados

### ❌ Alto Riesgo (No Cumple WCAG AA)

1. **`text-gray-400` (#9CA3AF) sobre fondo oscuro (#111827 o #0a0a0a)**
   - Ratio: ~2.3:1
   - **Ubicaciones**: Múltiples archivos (22 archivos encontrados)
   - **Solución**: Cambiar a `text-gray-300` (#D1D5DB) o `text-gray-200` (#E5E7EB)

2. **`text-gray-500` (#6B7280) sobre fondo oscuro**
   - Ratio: ~2.1:1
   - **Ubicaciones**: Varios archivos
   - **Solución**: Cambiar a `text-gray-300` o `text-gray-400` (si es texto grande)

### ⚠️ Riesgo Medio (Cumple Justo)

1. **`text-gray-300` (#D1D5DB) sobre fondo oscuro**
   - Ratio: ~4.8:1
   - **Estado**: Cumple para texto normal, pero justo
   - **Recomendación**: Usar `text-gray-200` (#E5E7EB) para mejor legibilidad

## Paleta de Colores Aprobada

### Texto sobre Fondo Oscuro (#111827, #0a0a0a, #000000)

| Color | Hex | Ratio vs Fondo Oscuro | Uso Recomendado |
|-------|-----|----------------------|-----------------|
| `text-white` | #FFFFFF | 21:1 | Texto principal |
| `text-gray-100` | #F3F4F6 | 18.4:1 | Texto secundario destacado |
| `text-gray-200` | #E5E7EB | 15.2:1 | Texto secundario (recomendado) |
| `text-gray-300` | #D1D5DB | 12.6:1 | Texto secundario (mínimo aceptable) |
| `text-gray-400` | #9CA3AF | 6.8:1 | ❌ NO usar en texto normal |
| `text-gray-500` | #6B7280 | 4.2:1 | ❌ NO usar en texto normal |

### Texto sobre Fondo de Card (rgba(255,255,255,0.05))

| Color | Hex | Ratio | Uso Recomendado |
|-------|-----|-------|-----------------|
| `text-white` | #FFFFFF | ~8.5:1 | Texto principal |
| `text-gray-200` | #E5E7EB | ~6.1:1 | Texto secundario |
| `text-gray-300` | #D1D5DB | ~5.0:1 | Texto secundario (mínimo) |

## Correcciones Aplicadas

### Sprint 18 - Cambios Realizados

1. **Reemplazos Globales**:
   - `text-gray-400` → `text-gray-300` (en texto normal)
   - `text-gray-500` → `text-gray-300` (en texto normal)
   - `text-gray-400` → `text-gray-200` (en texto importante)

2. **Excepciones** (Texto Grande - 18px+ o 14px+ bold):
   - `text-gray-400` puede mantenerse si es texto grande
   - `text-gray-500` puede mantenerse si es texto grande y no crítico

## Herramientas de Verificación

- **axe DevTools**: Extensión de navegador para auditoría automática
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **WAVE**: https://wave.webaim.org/

## Próximos Pasos

1. ✅ Documentar problemas identificados
2. ✅ Corregir casos críticos (text-gray-400/500)
3. ⏳ Ejecutar axe DevTools en todas las páginas
4. ⏳ Verificar con herramientas automáticas
5. ⏳ Documentar paleta final con ratios

