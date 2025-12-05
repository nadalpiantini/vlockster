# Fuentes VLOCKSTER

Este directorio debe contener las fuentes Space Grotesk en formato `.woff2`.

## Instrucciones para obtener las fuentes:

1. **Descarga Space Grotesk desde Google Fonts:**
   - Visita: https://fonts.google.com/specimen/Space+Grotesk
   - Haz clic en "Download family"
   - Extrae el ZIP

2. **Convierte a WOFF2 (si es necesario):**
   - Usa una herramienta como: https://cloudconvert.com/ttf-to-woff2
   - O usa `woff2_compress` si lo tienes instalado

3. **Coloca los archivos aquí:**
   - `SpaceGrotesk-Regular.woff2` (weight: 400)
   - `SpaceGrotesk-Bold.woff2` (weight: 700)

## Estructura esperada:

```
app/fonts/
  ├── SpaceGrotesk-Regular.woff2
  ├── SpaceGrotesk-Bold.woff2
  └── README.md (este archivo)
```

## Nota:

Si las fuentes no están disponibles, el sistema usará los fallbacks definidos en `tailwind.config.ts`:
- `font-sans` → Inter (desde Google Fonts)
- `font-display` → Space Grotesk (fallback a system-ui si no está disponible)

