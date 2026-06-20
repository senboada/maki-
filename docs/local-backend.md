# Backend Local Con Supabase

Maki+ puede correr contra Supabase local usando Docker. Esto permite desarrollar autenticacion, consentimiento, perfiles infantiles, RLS y guardado de progreso sin depender del proyecto cloud.

## Requisitos

- Docker Desktop instalado y corriendo.
- Node.js y npm.
- Expo Go compatible con el SDK del proyecto.

No es obligatorio instalar Supabase CLI globalmente porque los scripts usan `npx supabase`.

## Archivos Relevantes

- `supabase/config.toml`: configuracion local de Supabase.
- `supabase/migrations/0001_initial_schema.sql`: migracion inicial del schema.
- `database/schema.sql`: snapshot de referencia del schema actual.
- `.env.local.example`: ejemplo de variables para apuntar la app al backend local.

Desde la Fase 2.5, la fuente de verdad para cambios incrementales de base de datos debe ser `supabase/migrations`.

## Comandos

Levantar Supabase local:

```bash
npm run supabase:start
```

Ver URLs y llaves locales:

```bash
npm run supabase:status
```

Resetear la base de datos local y aplicar migraciones:

```bash
npm run db:reset
```

Detener Supabase local:

```bash
npm run supabase:stop
```

## Variables De Entorno

Copia `.env.local.example` a `.env` y reemplaza la anon key con la que entregue `npm run supabase:status`.

Para iOS Simulator en Mac:

```env
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=anon-key-from-supabase-status
```

Para Android Emulator normalmente se usa:

```env
EXPO_PUBLIC_SUPABASE_URL=http://10.0.2.2:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=anon-key-from-supabase-status
```

## Flujo Recomendado

1. Abrir Docker Desktop.
2. Ejecutar `npm run supabase:start`.
3. Ejecutar `npm run supabase:status`.
4. Copiar la anon key local al archivo `.env`.
5. Ejecutar `npm run ios`.
6. Probar registro/login cuando la Fase 3 este implementada.

## Fallback Local

Si `.env` no existe o faltan variables Supabase, la app sigue funcionando en modo `local` mediante el fallback ya preparado en la arquitectura.

Esto es intencional: Docker mejora el desarrollo, pero no debe bloquear a la app ni a otros desarrolladores.

## Notas De Seguridad

- No subir `.env` al repositorio.
- Las llaves locales de Supabase son para desarrollo.
- Las llaves de produccion deben configurarse aparte.
- RLS debe probarse localmente antes de conectar Supabase cloud.

## Problemas Comunes

Si Supabase no levanta, verifica que Docker este corriendo.

Si iOS Simulator no conecta, confirma que la URL sea `http://127.0.0.1:54321`.

Si Android Emulator no conecta, usa `http://10.0.2.2:54321`.

Si las tablas no aparecen, ejecuta:

```bash
npm run db:reset
```
