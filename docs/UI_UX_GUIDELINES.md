# UI/UX Guidelines - VLOCKSTER

> Guía completa de diseño y experiencia de usuario para la plataforma VLOCKSTER

**Última actualización**: 2025-01-27  
**Inspiración**: STREAMLAB (Netflix-like streaming platform)  
**Estado**: ✅ Completo

---

## 📋 Tabla de Contenidos

1. [Principios de Diseño](#principios-de-diseño)
2. [Sistema de Diseño](#sistema-de-diseño)
3. [Patrones de UI](#patrones-de-ui)
4. [Mejores Prácticas](#mejores-prácticas)
5. [Referencias y Recursos](#referencias-y-recursos)
6. [Checklist de Implementación](#checklist-de-implementación)

---

## Principios de Diseño

### 1. User-Centric Design
- **Prioridad**: Las necesidades del usuario están por encima de todo
- **Aplicación**: Cada decisión de diseño debe servir a un propósito del usuario
- **Validación**: Testear con usuarios reales antes de implementar cambios grandes

### 2. Simplicidad y Claridad
- **Menos es más**: Interfaces limpias sin elementos innecesarios
- **Navegación intuitiva**: Los usuarios deben encontrar contenido sin esfuerzo
- **Feedback inmediato**: Acciones del usuario deben tener respuesta visual clara

### 3. Consistencia Visual
- **Paleta de colores**: Mantener consistencia en toda la plataforma
- **Tipografía**: Sistema tipográfico coherente
- **Componentes**: Reutilizar componentes de shadcn/ui para consistencia

### 4. Performance First
- **Carga rápida**: Optimizar imágenes y assets
- **Lazy loading**: Cargar contenido bajo demanda
- **Progressive enhancement**: Funcionalidad básica primero, mejoras después

### 5. Accesibilidad Universal
- **WCAG 2.1 AA**: Cumplir estándares mínimos de accesibilidad
- **Keyboard navigation**: Navegación completa por teclado
- **Screen readers**: Compatibilidad con lectores de pantalla
- **Contraste**: Ratios de contraste adecuados (mínimo 4.5:1)

---

## Sistema de Diseño

### Paleta de Colores

#### Colores Principales (Inspirado en STREAMLAB)

```css
/* Colores de marca - Rojo (accent principal) */
--streamlab-primary: #FF0000;        /* Rojo principal */
--streamlab-secondary: #FF6B35;      /* Naranja/rojo secundario */
--streamlab-accent: #E50914;        /* Rojo Netflix-style */

/* Fondos oscuros */
--bg-primary: #050505;                /* Fondo más oscuro */
--bg-secondary: #0a0a0a;              /* Fondo secundario */
--bg-card: rgba(255, 255, 255, 0.05); /* Cards glassmorphism */

/* Texto */
--text-primary: #FFFFFF;               /* Texto principal */
--text-secondary: #E5E5E5;            /* Texto secundario */
--text-muted: #A0A0A0;                /* Texto deshabilitado */
--text-accent: #FF0000;                /* Texto de acento */
```

#### Variantes de Color (Opcional)

```css
/* Variante Azul (como en STREAMLAB Blue Demo) */
--blue-primary: #0071EB;
--blue-secondary: #0056B3;

/* Variante Verde (para CTAs de creators) */
--green-primary: #14E06E;
--green-secondary: #0FA968;
```

### Tipografía

```css
/* Fuente principal */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Escala tipográfica */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */
--text-8xl: 6rem;        /* 96px */
```

### Espaciado

```css
/* Sistema de espaciado (múltiplos de 4px) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Componentes Base (shadcn/ui)

- **Button**: Botones con variantes (primary, secondary, outline, ghost)
- **Card**: Cards con glassmorphism effect
- **Input**: Campos de formulario accesibles
- **Label**: Etiquetas para formularios
- **Textarea**: Áreas de texto

---

## Patrones de UI

### 1. Header/Navegación (Estilo STREAMLAB)

**Estructura**:
```
[Logo + VLOCKSTER] [Nav Links] [Search] [Profile] [SUBSCRIBE Button]
```

**Características**:
- **Fixed position**: Header fijo en scroll
- **Backdrop blur**: Efecto glassmorphism (`backdrop-blur-xl`)
- **Border sutil**: `border-b border-white/5`
- **Altura**: `h-20` (80px)
- **Navegación central**: Links con hover effects
- **Botón CTA**: Rojo destacado a la derecha

**Implementación**:
```tsx
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-20">
      {/* Logo */}
      {/* Navigation Links */}
      {/* Search & Profile Icons */}
      {/* SUBSCRIBE Button */}
    </div>
  </div>
</nav>
```

### 2. Hero Section (Estilo STREAMLAB)

**Estructura**:
```
[Badge: "HIGH RATED" / "TRENDING NOW"]
[Título Grande del Contenido]
[Ratings: TVMA, IMDb 9.5]
[Descripción]
[Cast, Genre, Tags]
[PLAY NOW Button] [WATCH TRAILER Button]
[Imagen de Fondo Grande]
[Mini Preview a la derecha]
[Flechas de navegación]
```

**Características**:
- **Altura**: `min-h-[90vh]` o `min-h-[600px]`
- **Background**: Imagen grande con overlay oscuro
- **Gradientes**: Overlays con gradientes radiales sutiles
- **Contenido centrado**: Texto sobre imagen con buen contraste
- **Botones**: 
  - "PLAY NOW": Rojo sólido (`bg-[#FF0000]`)
  - "WATCH TRAILER": Blanco con borde (`border-white/20`)
- **Mini preview**: Thumbnail pequeño a la derecha con play icon

**Implementación**:
```tsx
<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
    {/* Overlays y efectos */}
  </div>
  
  {/* Content */}
  <div className="container mx-auto px-4 relative z-10">
    {/* Badge, Title, Description, Buttons */}
  </div>
</section>
```

### 3. Secciones de Contenido (Thumbnails Horizontales)

**Estructura**:
```
[Section Title: "All Time Hits"]
[Horizontal Scroll de Thumbnails]
[MORE VIDEOS Button]
```

**Características**:
- **Título de sección**: Grande, destacado
- **Scroll horizontal**: Thumbnails en fila con scroll
- **Thumbnails**: 
  - Imagen (aspect-ratio: 16/9)
  - Título
  - Duración
  - Género (badge)
  - Iconos de acción (like, share, add)
- **Hover effects**: Scale y shadow en hover
- **Botón "MORE"**: A la derecha del título

**Implementación**:
```tsx
<section className="py-12">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold">All Time Hits</h2>
      <button className="text-[#FF0000] hover:underline">MORE VIDEOS</button>
    </div>
    
    <div className="flex gap-4 overflow-x-auto pb-4">
      {/* Thumbnail Cards */}
    </div>
  </div>
</section>
```

### 4. Glassmorphism Cards

**Características**:
- **Background**: `rgba(255, 255, 255, 0.05)`
- **Backdrop blur**: `backdrop-blur(10px)`
- **Border**: `border border-white/10`
- **Hover**: Aumentar opacidad y border color

**Implementación**:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card-hover:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 0, 0, 0.3);
  transform: translateY(-5px);
}
```

### 5. Botones CTA

**Variantes**:

1. **Primary (Rojo)**:
   ```tsx
   className="px-8 py-4 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-bold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all shadow-2xl shadow-red-500/40"
   ```

2. **Secondary (Outline)**:
   ```tsx
   className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/10 transition-all"
   ```

3. **Ghost**:
   ```tsx
   className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors"
   ```

---

## Mejores Prácticas

### Performance

1. **Optimización de Imágenes**:
   - Usar `next/image` con `priority` para hero images
   - Lazy loading para thumbnails
   - Formatos modernos (WebP, AVIF)
   - Tamaños responsivos con `sizes`

2. **Code Splitting**:
   - Server Components por defecto
   - Client Components solo cuando necesario
   - Dynamic imports para componentes pesados

3. **Caching**:
   - Static generation cuando sea posible
   - ISR (Incremental Static Regeneration) para contenido dinámico
   - Cache headers apropiados

### Accesibilidad

1. **Semantic HTML**:
   - Usar elementos semánticos (`<nav>`, `<main>`, `<section>`)
   - Headings jerárquicos (h1 → h2 → h3)
   - ARIA labels cuando sea necesario

2. **Keyboard Navigation**:
   - Todos los elementos interactivos accesibles por teclado
   - Focus visible claro
   - Tab order lógico

3. **Screen Readers**:
   - Alt text descriptivo en imágenes
   - Labels en formularios
   - ARIA roles cuando sea necesario

4. **Contraste**:
   - Texto sobre fondo: mínimo 4.5:1
   - Texto grande: mínimo 3:1
   - Usar herramientas como WebAIM Contrast Checker

### Responsive Design

1. **Breakpoints** (Tailwind):
   ```css
   sm: 640px   /* Mobile landscape */
   md: 768px   /* Tablet */
   lg: 1024px  /* Desktop */
   xl: 1280px  /* Large desktop */
   2xl: 1536px /* Extra large */
   ```

2. **Mobile First**:
   - Diseñar para mobile primero
   - Agregar estilos para pantallas grandes
   - Testear en dispositivos reales

3. **Touch Targets**:
   - Mínimo 44x44px para elementos táctiles
   - Espaciado adecuado entre botones

### SEO

1. **Metadata**:
   - Títulos únicos y descriptivos
   - Meta descriptions (150-160 caracteres)
   - Open Graph tags
   - Twitter Cards

2. **Structured Data**:
   - Schema.org markup
   - JSON-LD para videos y contenido

3. **Performance**:
   - Core Web Vitals optimizados
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## Referencias y Recursos

### Inspiración de Diseño

1. **STREAMLAB** (Referencia principal)
   - Diseño moderno tipo Netflix
   - Hero sections impactantes
   - Navegación clara
   - Thumbnails horizontales

2. **Netflix**
   - [Netflix.com](https://www.netflix.com) - Referencia de UX de streaming
   - Navegación intuitiva
   - Personalización de contenido
   - Autoplay y previews

3. **Disney+**
   - [DisneyPlus.com](https://www.disneyplus.com) - Diseño premium
   - Hero sections grandes
   - Categorización clara

4. **Spotify**
   - [Spotify.com](https://www.spotify.com) - Referencia de UI moderna
   - Dark theme efectivo
   - Navegación lateral

### Recursos de UI/UX

1. **Documentación de Componentes**:
   - [shadcn/ui](https://ui.shadcn.com) - Componentes base
   - [Radix UI](https://www.radix-ui.com) - Primitivos accesibles
   - [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

2. **Mejores Prácticas**:
   - [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
   - [MDN Web Docs](https://developer.mozilla.org) - Referencia técnica
   - [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

3. **Herramientas de Diseño**:
   - [Figma](https://www.figma.com) - Diseño y prototipado
   - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verificar contraste
   - [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance y accesibilidad

4. **Repositorios de Referencia**:
   - [aprende-diseno-uxui](https://github.com/crisbusquets/aprende-diseno-uxui) - Recursos en español
   - [awesome-design-systems](https://github.com/alexpate/awesome-design-systems) - Sistemas de diseño

### Artículos y Guías

1. **Streaming Platform Design**:
   - [KeepCoding - Diseño UI/UX para plataformas de streaming](https://keepcoding.io/blog/diseno-ui-ux-para-plataformas-de-streaming/)
   - [Drianka - 10 mejores prácticas UX/UI](https://drianka.com/2025/01/31/las-10-mejores-practicas-en-ux-ui-para-mejorar-la-usabilidad-de-tu-web/)

2. **Next.js Performance**:
   - [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
   - [Web.dev - Core Web Vitals](https://web.dev/vitals/)

---

## Checklist de Implementación

### Landing Page

- [ ] Header fijo con navegación clara
- [ ] Hero section con imagen de fondo y contenido destacado
- [ ] Badge "TRENDING" o "HIGH RATED"
- [ ] Botones CTA (PLAY NOW, WATCH TRAILER)
- [ ] Secciones de contenido con thumbnails horizontales
- [ ] Scroll horizontal funcional
- [ ] Hover effects en thumbnails
- [ ] Footer con links y información

### Accesibilidad

- [ ] Semantic HTML (`<nav>`, `<main>`, `<section>`)
- [ ] ARIA labels donde sea necesario
- [ ] Keyboard navigation funcional
- [ ] Focus visible en todos los elementos
- [ ] Contraste de colores adecuado (4.5:1 mínimo)
- [ ] Alt text en todas las imágenes
- [ ] Screen reader compatible

### Performance

- [ ] Imágenes optimizadas con `next/image`
- [ ] Lazy loading implementado
- [ ] Code splitting apropiado
- [ ] Core Web Vitals optimizados
- [ ] Caching configurado

### Responsive

- [ ] Mobile first approach
- [ ] Breakpoints testeados (sm, md, lg, xl, 2xl)
- [ ] Touch targets adecuados (44x44px mínimo)
- [ ] Navegación mobile funcional
- [ ] Imágenes responsivas

### SEO

- [ ] Metadata completa (title, description, keywords)
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Structured data (Schema.org)
- [ ] Sitemap actualizado
- [ ] robots.txt configurado

### Estilo Visual

- [ ] Paleta de colores consistente
- [ ] Tipografía coherente
- [ ] Espaciado consistente
- [ ] Glassmorphism effects aplicados
- [ ] Animaciones suaves
- [ ] Transiciones apropiadas

---

## Notas de Implementación

### Componentes Reutilizables

Crear componentes reutilizables para:
- `HeroSection` - Hero con imagen de fondo
- `ContentSection` - Sección con thumbnails horizontales
- `ThumbnailCard` - Card individual de video/proyecto
- `Navigation` - Header con navegación
- `CTAButton` - Botones de llamada a la acción

### Animaciones

Usar animaciones sutiles:
- Fade in al cargar
- Hover effects suaves
- Transiciones de 200-300ms
- Evitar animaciones excesivas

### Estados de Carga

Implementar:
- Skeleton loaders para contenido
- Loading states en botones
- Error states con mensajes claros
- Empty states informativos

---

**Mantenimiento**: Actualizar este documento cuando se agreguen nuevos patrones o componentes al sistema de diseño.

