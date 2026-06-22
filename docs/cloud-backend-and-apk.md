# Backend Cloud Y APK Interno

## Objetivo

Usar Supabase cloud free como backend y generar un APK interno de depuración apuntando a esa URL.

## Supabase Cloud

1. Crear o elegir un proyecto en Supabase.
2. Copiar estos valores desde `Project Settings > API`:
   - `Project URL`
   - `anon public key`
3. Vincular el repo al proyecto:

```bash
npx supabase link --project-ref <project-ref>
```

4. Aplicar migraciones:

```bash
npx supabase db push
```

5. Verificar en Supabase Studio que existan:
   - `parent_profiles`
   - `child_profiles`
   - `game_sessions`
   - `game_answers`

6. Verificar que `child_profiles` tenga:
   - `last_name`
   - `avatar_animal`

## Variables Para APK

Crear `.env.production` local con:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-cloud-anon-key
```

Para EAS Build, configurar esas variables en el proyecto EAS o pasarlas como variables de entorno al lanzar el build.

## APK Interno

El perfil `preview` en `eas.json` genera APK instalable:

```bash
npx eas build --platform android --profile preview
```

Si se quiere generar una APK con cliente de desarrollo:

```bash
npx eas build --platform android --profile development
```

## QA Antes De Compartir APK

```bash
npm run typecheck
npm run check:math
npx expo-doctor
npx expo export --platform android --clear
```

Flujos manuales mínimos:

1. Registro nuevo.
2. Consentimiento.
3. Datos del niño con animal elegido.
4. Fiesta inicial en Home.
5. Menú del avatar: Perfil y cerrar sesión.
6. Editar perfil.
7. Cambiar contraseña.
8. Juego Tesoro.
9. Juego Parejas.
10. Juego Clave secreta.
11. Juego Laberinto.
12. Validar sesiones/respuestas en Supabase cloud.

## Pendientes Para Publicación Real En Tienda

El APK interno sirve para depurar en celular. Para Play Store todavía faltan:

- Icono final de app y adaptive icon.
- Splash final.
- Política de privacidad pública.
- Textos de ficha de Play Store.
- Revisión de permisos y clasificación de contenido infantil.
- Cuenta Google Play Console.
