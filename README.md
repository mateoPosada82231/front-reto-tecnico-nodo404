# Ejercicios Frontend

## Prácticas de desarrollo

### Stack principal

| Práctica                    | Decisión                                                         |
| --------------------------- | ---------------------------------------------------------------- |
| Estilos                     | **Tailwind CSS** (v4)                                            |
| Enfoque CSS                 | **Mobile First**                                                 |
| Estructura de carpetas      | **Folder Feature + Atomic Design**                               |
| Gestor de paquetes          | **pnpm**                                                         |
| Creación de proyecto        | **Vite**                                                         |
| Nomenclatura de clases HTML | **BEM** (cuando no se use Tailwind)                              |
| User Feedback               | **Obligatorio** — toda interacción debe tener feedback visual/UX |

### Convenciones

- **Mobile First**: escribir CSS base para mobile, luego `@media (min-width: ...)` para desktop.
- **Folder Feature**: agrupar por funcionalidad (`features/auth/`, `features/tasks/`), no por tipo técnico.
- **Atomic Design**: dentro de cada feature, organizar componentes como `atoms/`, `molecules/`, `organisms/`.
- **BEM**: si se necesita CSS adicional fuera de Tailwind, usar `Bloque__Elemento--Modificador`.
- **User Feedback**: loading states, empty states, error states, confirmaciones, transiciones suaves. Toda acción del usuario debe tener una respuesta visual.

### Recomendaciones adicionales

| Práctica | Recomendación    |
| -------- | ---------------- |
| Iconos   | **Lucide React** |
| Fechas   | **date-fns**     |

### Buenas prácticas de Git

- **Ramas**: usar `feature/`, `fix/`, `refactor/` como prefijos (ej. `feature/login`, `fix/header-styles`).
- **Commits atómicos**: un commit por cambio lógico; evitar commits gigantes.
- **Conventional Commits**:
  ```
  feat: añadir login con Google
  fix: corregir error en validación de email
  refactor: extraer hook useAuth
  chore: actualizar dependencias
  ```
- **PRs pequeños**: mantener las Pull Requests enfocadas en un solo propósito.
- **No commiter secrets**: usar `.env` local y `.gitignore`; nunca subir claves.
- ** `.gitignore`**: incluir `node_modules/`, `dist/`, `.env`, `.vite/`.
- **Code reviews**: revisar antes de mergear; mantener la rama principal limpia.
- **Mantener historia limpia**: usar `rebase` en lugar de `merge` en ramas locales; evitar `merge commits` innecesarios.

### Scripts comunes

```bash
pnpm dev        # Iniciar servidor de desarrollo
pnpm build      # Construir para producción
pnpm preview    # Previsualizar build
pnpm lint       # Ejecutar linter
pnpm test       # Ejecutar tests
```
