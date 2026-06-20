# Seguridad De Base De Datos

Este documento resume las decisiones de seguridad y privacidad aplicadas en `database/schema.sql` para el MVP de Maki+.

## Principios

- El nino no crea cuenta directamente.
- La cuenta pertenece al padre, madre o acudiente mediante Supabase Auth.
- El perfil infantil guarda solo datos minimos para personalizar la experiencia.
- No se guarda apellido, foto, direccion, telefono, ubicacion ni datos escolares sensibles.
- El consentimiento del acudiente se guarda antes de permitir el uso normal de la app.
- Row Level Security queda habilitado en todas las tablas de datos de aplicacion.

## Tablas

- `parent_profiles`: datos minimos del acudiente y consentimiento.
- `child_profiles`: perfil basico del nino asociado al acudiente.
- `game_sessions`: resumen de cada sesion de practica o juego.
- `game_answers`: respuestas registradas dentro de una sesion.

## Migraciones

El schema inicial tambien existe como migracion en `supabase/migrations/0001_initial_schema.sql` para poder levantar y resetear Supabase local con Docker.

Desde la Fase 2.5, los cambios incrementales de base de datos deben agregarse como nuevas migraciones en `supabase/migrations`.

## RLS

Cada policy limita el acceso al usuario autenticado con `auth.uid()`.

- Un acudiente solo puede ver, crear y actualizar su propio `parent_profile`.
- Un acudiente solo puede acceder a perfiles de ninos vinculados a su `parent_profile`.
- Un acudiente solo puede acceder a sesiones de juego de sus perfiles infantiles.
- Un acudiente solo puede acceder a respuestas asociadas a sus propias sesiones.

## Eliminacion De Datos

El MVP no define policies de `delete`. Esto evita borrados accidentales desde la app durante la primera version.

Cuando se implemente gestion de cuenta, se debe agregar un flujo explicito para eliminacion de datos del acudiente y perfiles asociados.

## Validaciones

El SQL incluye constraints para reducir datos invalidos:

- Edad del nino entre 4 y 10.
- Nombre no vacio.
- Temas de refuerzo limitados a suma, resta, multiplicacion y division.
- Tipos de juego limitados a los juegos soportados.
- Operaciones limitadas a las cuatro operaciones del MVP.
- Sesiones de practica requieren operacion y numero seleccionado.
- Preguntas y respuestas evitan valores estructuralmente invalidos.

## Pendientes Para Produccion

- Crear politica de privacidad publica antes de publicar en tiendas.
- Revisar requisitos COPPA/GDPR-K si se publica fuera de Colombia o Latinoamerica.
- Agregar flujo de eliminacion de cuenta/datos.
- Agregar auditoria o logs minimos si el producto crece.
- Revisar backups y retencion de datos en Supabase.
