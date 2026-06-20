# Epica Tecnica: Maki+ MVP Educativo Infantil

## Objetivo

Crear **Maki+**, una aplicacion mobile educativa para Android e iOS orientada a ninos y ninas de 4 a 10 anos, enfocada en practicar suma, resta, multiplicacion y division mediante una experiencia visual, interactiva, segura y divertida.

El objetivo principal no es construir una app escolar tradicional, sino una experiencia tipo arcade infantil donde el nino practique muchas veces sin sentir que esta en una evaluacion. La app debe motivar con animales tiernos, colores suaves, botones grandes, feedback positivo, microanimaciones y mini juegos simples.

## Contexto Del Problema

Los ninos necesitan repetir operaciones matematicas basicas para ganar seguridad, memoria y agilidad mental. Esto es especialmente importante en multiplicaciones, donde la practica repetida tiene mucho peso, pero tambien aplica a suma, resta y division.

El repaso tradicional suele sentirse aburrido, repetitivo o como una obligacion. Maki+ busca transformar esa practica en una aventura infantil segura, visual y motivadora.

## Resultado Esperado

Un MVP publicable y mantenible donde:

- El acudiente pueda registrarse, iniciar sesion y recuperar contrasena.
- El acudiente acepte un consentimiento obligatorio.
- El acudiente cree el perfil basico del nino.
- El nino pueda entrar a un home visual y elegir entre **Juegos** o **Practicas**.
- En Practicas pueda seleccionar operacion, numero a reforzar y mini juego.
- En Juegos pueda elegir un mini juego con operaciones mixtas.
- El motor matematico genere preguntas correctas, aleatorias y apropiadas para la edad.
- El progreso basico se guarde en Supabase/PostgreSQL.
- La app funcione tambien en modo fallback local si faltan variables de Supabase.
- La experiencia visual tenga identidad propia basada en animales tiernos, iconografia clara y animaciones suaves.

## Evaluacion De `prompt.md`

La propuesta de `docs/prompt.md` esta bien orientada y cubre la mayoria de necesidades importantes para un MVP serio: stack tecnico, flujo de usuario, Supabase, privacidad infantil, motor matematico, mini juegos, persistencia, criterios de aceptacion y documentacion.

### Lo Que Esta Correcto

- Define con claridad el problema y el objetivo del MVP.
- Mantiene separacion entre acudiente y nino.
- Incluye consentimiento obligatorio.
- Evita pedir datos sensibles del menor.
- Propone Supabase/PostgreSQL como backend viable para un MVP con free tier.
- Exige desacoplar servicios para no usar Supabase directamente en pantallas.
- Incluye fallback local, util para desarrollo temprano.
- Define reglas matematicas especificas para cada operacion.
- Pide componentes reutilizables y arquitectura limpia.
- Incluye criterios de aceptacion concretos.

### Lo Que Conviene Mejorar

- El alcance es grande para una primera iteracion si se intenta construir todo al mismo tiempo.
- Los 4 mini juegos tienen complejidad diferente; no deberian implementarse con la misma prioridad.
- La propuesta visual necesita mas peso para evitar una app funcional pero generica.
- El uso de librerias debe ser conservador para mantener compatibilidad con Expo y facilitar publicacion.
- Falta separar explicitamente un MVP publicable minimo de un MVP completo con todos los juegos pulidos.
- Faltan tareas explicitas de QA para el motor matematico, que es una parte critica del producto.
- Faltan tareas explicitas de checklist de privacidad y preparacion para tiendas.

### Recomendacion General

Mantener `prompt.md` como vision completa, pero ejecutar por fases. La prioridad debe ser:

1. Arquitectura base segura y simple.
2. Identidad visual infantil reutilizable.
3. Flujo de acudiente, consentimiento y perfil del nino.
4. Motor matematico confiable.
5. Practicas funcionando con al menos un juego muy pulido.
6. Persistencia de sesiones.
7. Expansion progresiva a los 4 mini juegos.

## Principios De Producto

- La app es para practicar, no para castigar errores.
- El nino no crea cuenta directamente.
- El adulto responsable administra el acceso y acepta consentimiento.
- No se pide apellido, foto, direccion, telefono ni ubicacion del nino.
- No hay chat, publicidad, compras ni comunicacion con terceros en el MVP.
- Las instrucciones para ninos deben ser cortas, positivas y visuales.
- El error debe tratarse como oportunidad de intento, no como fracaso.
- Los botones deben ser grandes y faciles de tocar.
- El diseno debe funcionar principalmente en vertical.
- La app debe ser entendible en pantallas pequenas.

## Direccion Visual Y Animacion

Maki+ debe tener una identidad grafica propia. No se considera suficiente entregar formularios y tarjetas genericas. La app debe sentirse como una aventura infantil con animales tiernos, mundos simples y feedback visual alegre.

### Estilo Visual

- Animales tiernos, redondeados y expresivos.
- Personajes sin genero marcado, aptos para ninos y ninas.
- Paleta pastel viva: menta, coral, amarillo suave, azul cielo, lavanda y crema.
- Fondos claros con elementos decorativos: nubes, hojas, estrellas, flores, caminos, cofres y burbujas.
- Botones grandes con bordes redondeados.
- Tarjetas tipo burbuja, cofre, mapa, jardin o puerta secreta.
- Iconos grandes y reconocibles.
- Microanimaciones suaves, no agresivas.

### Animales Sugeridos

- Home: panda o mono guia.
- Practicas: buho sabio o tortuga paciente.
- Juegos: zorro explorador o conejo aventurero.
- Tesoro: mapache o mono explorador.
- Parejas: grupo de animales tiernos.
- Contrasena secreta: panda detective.
- Laberinto: tortuga, raton o conejo explorador.

### Componentes Graficos Recomendados

- `AnimalMascot`: mascota reusable con variantes por animal y emocion.
- `AnimalCard`: tarjeta grande con animal, titulo, color y accion.
- `GameWorldBackground`: fondo visual reutilizable por mundo o juego.
- `CelebrationStars`: estrellas para respuestas correctas.
- `SoftFeedbackBubble`: burbuja con mensajes positivos.
- `PathChoiceCard`: caminos/respuestas para el juego del tesoro.
- `NumberKeypad`: teclado infantil para contrasena secreta.
- `ProgressStars`: progreso visual con estrellas.
- `GameFeedback`: feedback comun de acierto/error.

### Animaciones Recomendadas

- Al acertar: rebote suave, brillo, estrellas o avance del personaje.
- Al fallar: vibracion visual leve, animal pensativo y mensaje amable.
- Al completar: confeti simple, estrellas y personaje celebrando.
- En botones: escala suave al presionar.
- En progreso: estrellas que se llenan.

### Librerias Visuales Recomendadas

- `@expo/vector-icons`: iconos compatibles con Expo y faciles de mantener.
- `react-native-svg`: formas, ilustraciones simples, trazos, caminos, estrellas y lineas de juegos.
- `react-native-reanimated`: solo si las animaciones lo justifican; no agregar por defecto si se puede resolver simple.
- `lottie-react-native`: opcional y no prioritario; usar solo con assets livianos, propios o con licencia clara.

### Reglas Para Assets

- No usar imagenes remotas como dependencia critica del MVP.
- No usar assets con licencias dudosas.
- Preferir graficos vectoriales/componentes propios al inicio.
- Mantener el tamano de la app razonable.
- Documentar cualquier asset externo usado.

## Stack Tecnico Recomendado

- React Native con Expo.
- TypeScript.
- React Navigation.
- Supabase como backend principal del MVP.
- PostgreSQL mediante Supabase.
- Supabase Auth para autenticacion del acudiente.
- Row Level Security para proteger datos por acudiente.
- AsyncStorage solo como fallback local o cache.
- Context API o Zustand para estado global ligero.
- Variables de entorno con `.env` y `.env.example`.
- Componentes reutilizables.
- Servicios desacoplados de las pantallas.

## Dependencias: Criterio De Uso

Agregar dependencias solo cuando aporten valor claro al MVP y sean compatibles con Expo.

Dependencias base esperadas:

- `@react-navigation/native`
- Navegadores necesarios de React Navigation.
- `@supabase/supabase-js`
- `@react-native-async-storage/async-storage`
- `@expo/vector-icons`

Dependencias condicionadas:

- `react-native-svg`: si se implementan trazos, lineas, figuras o ilustraciones vectoriales.
- `react-native-reanimated`: si se necesitan animaciones mas ricas que `Animated` no resuelva bien.
- `zustand`: si el estado global con Context empieza a crecer demasiado.
- `lottie-react-native`: solo si hay animaciones livianas y con licencia clara.

## Alcance Del MVP Publicable

El MVP publicable debe incluir:

- Registro, login, logout y recuperacion de contrasena para acudiente.
- Consentimiento obligatorio antes de usar la app.
- Perfil del nino con datos minimos: nombre, edad, genero opcional y temas a reforzar.
- Home con bienvenida personalizada.
- Flujo de Practicas.
- Flujo de Juegos.
- Motor matematico centralizado.
- Al menos 2 mini juegos visualmente agradables y funcionales.
- Persistencia de sesiones y respuestas.
- Fallback local para desarrollo sin Supabase.
- `database/schema.sql` con RLS.
- `docs/deployment.md`.
- `.env.example`.
- Diseno visual coherente con animales tiernos e iconografia.

## Alcance Del MVP Completo

El MVP completo debe incluir los 4 mini juegos:

- Contrasena secreta.
- Encontrar el tesoro.
- Laberinto.
- Encontrar la pareja.

La recomendacion es implementarlos en este orden:

1. Contrasena secreta: menor complejidad tecnica, alto valor de practica.
2. Encontrar el tesoro: buena experiencia visual, complejidad moderada.
3. Laberinto: requiere trazos/gestos, complejidad media.
4. Encontrar la pareja: requiere emparejamiento visual y gestos mas complejos.

## Fuera De Alcance Inicial

- Rankings sociales.
- Multiplayer.
- Chat.
- Publicidad.
- Compras dentro de la app.
- Avatares con foto real.
- Ubicacion.
- Datos escolares sensibles.
- Analytics invasivo.
- IA generativa dentro de la experiencia infantil.
- Backend propio fuera de Supabase.
- Panel administrativo completo.

## Arquitectura Esperada

Estructura sugerida:

```text
src/
  app/
  navigation/
  providers/
  screens/
    auth/
    onboarding/
    home/
    practice/
    games/
  components/
    ui/
    game/
    child/
    graphics/
  domain/
    math/
    games/
  services/
  storage/
  theme/
  utils/
database/
  schema.sql
docs/
  deployment.md
.env.example
```

Reglas:

- Las pantallas no deben llamar directamente a Supabase.
- Las pantallas no deben llamar directamente a AsyncStorage.
- La logica matematica vive en `domain/math`.
- La logica comun de juegos vive en `domain/games`.
- La identidad visual vive en `theme` y `components/graphics`.
- Los servicios encapsulan persistencia y backend.

## Backlog Por Fases

### Fase 0: Preparacion Del Proyecto

Objetivo: dejar una base Expo + TypeScript limpia y lista para crecer.

Tareas:

- Inicializar proyecto Expo con TypeScript si no existe.
- Configurar estructura base de carpetas.
- Crear `.env.example`.
- Crear `docs/deployment.md` inicial.
- Definir scripts de ejecucion, typecheck y lint si aplica.
- Verificar que la app arranque en Expo.

Criterios de aceptacion:

- La app corre con `npx expo start`.
- El proyecto usa TypeScript.
- Existe estructura base por carpetas.
- No hay credenciales hardcodeadas.

### Fase 0.5: Direccion Visual Y Sistema Grafico

Objetivo: definir la personalidad visual antes de construir pantallas finales.

Tareas:

- Definir paleta final en `theme/colors.ts`.
- Definir espaciado en `theme/spacing.ts`.
- Definir tipografia en `theme/typography.ts`.
- Crear componentes UI base: `AppButton`, `AppCard`, `AppInput`, `ScreenContainer`.
- Crear componentes graficos: `AnimalMascot`, `AnimalCard`, `GameWorldBackground`, `CelebrationStars`, `SoftFeedbackBubble`.
- Integrar `@expo/vector-icons`.
- Evaluar si `react-native-svg` es necesario para graficos iniciales.
- Definir microanimaciones base para acierto, error y boton presionado.

Criterios de aceptacion:

- La app tiene identidad visual infantil consistente.
- Existen componentes graficos reutilizables.
- No se usan assets externos sin licencia clara.
- Los botones y tarjetas son aptos para dedos pequenos.

### Fase 1: Arquitectura Base

Objetivo: implementar navegacion, providers y servicios desacoplados.

Tareas:

- Crear `RootNavigator`.
- Crear `AuthNavigator`.
- Crear `AppNavigator`.
- Crear `AuthProvider`.
- Crear `AppProvider`.
- Crear `storageClient` y `storageKeys`.
- Crear `supabaseClient` con deteccion de variables faltantes.
- Definir modo backend: Supabase o fallback local.
- Crear tipos base compartidos.

Criterios de aceptacion:

- La navegacion decide correctamente entre auth, consentimiento, onboarding y home.
- Supabase no se usa directamente en pantallas.
- AsyncStorage no se usa directamente en pantallas.
- La app no se rompe si faltan variables de Supabase.

### Fase 2: Base De Datos Y Seguridad

Objetivo: crear modelo inicial seguro para Supabase/PostgreSQL.

Tareas:

- Crear `database/schema.sql`.
- Crear tabla `parent_profiles`.
- Crear tabla `child_profiles`.
- Crear tabla `game_sessions`.
- Crear tabla `game_answers`.
- Agregar primary keys y foreign keys.
- Agregar indices basicos.
- Agregar `created_at` y `updated_at`.
- Agregar funcion para actualizar `updated_at`.
- Habilitar Row Level Security.
- Crear policies para que cada acudiente acceda solo a sus datos.
- Documentar decisiones de privacidad infantil.

Criterios de aceptacion:

- El SQL puede ejecutarse en Supabase.
- RLS esta habilitado.
- Las policies limitan acceso por usuario autenticado.
- No se guardan datos sensibles innecesarios del nino.

### Fase 2.5: Backend Local Con Supabase Docker

Objetivo: permitir desarrollo local realista con Supabase Auth, PostgreSQL, RLS y migraciones antes de implementar auth/onboarding.

Tareas:

- Configurar Supabase local en `supabase/config.toml`.
- Crear migracion inicial en `supabase/migrations` desde el schema de Fase 2.
- Agregar scripts para iniciar, detener, consultar estado y resetear la base local.
- Crear `.env.local.example` para iOS Simulator y Android Emulator.
- Documentar flujo de backend local en `docs/local-backend.md`.
- Mantener fallback local de la app si Supabase no esta configurado o Docker no esta corriendo.
- Definir `supabase/migrations` como fuente de verdad para cambios incrementales del schema.

Criterios de aceptacion:

- Existe configuracion Supabase local versionada.
- Existe migracion inicial ejecutable por Supabase CLI.
- La app puede apuntar a `http://127.0.0.1:54321` desde iOS Simulator.
- El fallback local se conserva si faltan variables Supabase.
- La documentacion explica iOS Simulator, Android Emulator y reset de base de datos.

### Fase 3: Auth, Consentimiento Y Onboarding

Objetivo: permitir que el acudiente entre y configure el perfil infantil de forma segura.

Tareas:

- Implementar `authService`.
- Implementar `parentProfileService`.
- Implementar `childProfileService`.
- Crear `LoginScreen`.
- Crear `RegisterScreen`.
- Crear `ForgotPasswordScreen`.
- Crear `ConsentDialog` obligatorio.
- Crear `ChildOnboardingScreen`.
- Validar correo, contrasena y confirmacion.
- Validar edad entre 4 y 10.
- Validar seleccion de al menos un tema a reforzar.
- Guardar consentimiento con fecha.
- Guardar perfil del nino.

Criterios de aceptacion:

- El acudiente puede registrarse e iniciar sesion.
- El usuario no puede continuar sin aceptar consentimiento.
- El perfil del nino se crea con datos minimos.
- El flujo redirige correctamente segun estado.

### Fase 4: Home Infantil

Objetivo: crear la pantalla principal con identidad visual fuerte.

Tareas:

- Crear `HomeScreen`.
- Mostrar `Bienvenido/a, {nombreDelNino}`.
- Mostrar mascota guia.
- Mostrar tarjeta grande de Juegos.
- Mostrar tarjeta grande de Practicas.
- Agregar iconos y elementos graficos.
- Agregar microanimaciones suaves.
- Asegurar soporte para pantallas pequenas.

Criterios de aceptacion:

- El home no se ve generico.
- El nino entiende facilmente que puede jugar o practicar.
- Las areas tactiles son grandes.
- La navegacion a Juegos y Practicas funciona.

### Fase 5: Motor Matematico

Objetivo: centralizar generacion y validacion de preguntas.

Tareas:

- Crear `domain/math/mathTypes.ts`.
- Crear `domain/math/mathGenerator.ts`.
- Definir `OperationType`.
- Definir `MathQuestion`.
- Implementar `generateMathQuestion`.
- Implementar `generatePracticeQuestions`.
- Implementar `generateRandomMixedQuestions`.
- Implementar `generateAnswerOptions`.
- Garantizar que opciones incorrectas no repitan la correcta.
- Garantizar divisiones exactas.
- Garantizar restas sin negativos.
- Garantizar que practica respete numero seleccionado.
- Agregar tests o validaciones manuales automatizables si el proyecto no tiene test runner.

Criterios de aceptacion:

- Multiplicacion respeta tablas del 1 al 10.
- Suma incluye el numero elegido como sumando.
- Resta usa el numero elegido como sustraendo y evita negativos.
- Division usa el numero elegido como divisor y genera resultado entero.
- Las preguntas no son secuenciales.
- Las respuestas incorrectas son cercanas y no duplicadas.

### Fase 6: Flujo De Practicas

Objetivo: permitir practica guiada por operacion y numero.

Tareas:

- Crear `PracticeMenuScreen`.
- Crear `PracticeNumberSelectorScreen`.
- Crear `PracticeGameSelectorScreen`.
- Mostrar suma, resta, multiplicacion y division.
- Mostrar rangos correctos por operacion.
- Pasar `operation`, `selectedNumber`, `gameType` y `totalQuestions` al juego.
- Usar tarjetas visuales con animales e iconos.

Criterios de aceptacion:

- El nino puede elegir operacion.
- El nino puede elegir numero.
- El nino puede elegir mini juego.
- La configuracion llega correctamente al juego.

### Fase 7: Flujo De Juegos

Objetivo: permitir jugar con operaciones mixtas.

Tareas:

- Crear `GamesMenuScreen`.
- Mostrar los 4 juegos como tarjetas visuales.
- Configurar modo `random`.
- Generar operaciones mixtas.
- Reutilizar el motor matematico.

Criterios de aceptacion:

- El nino puede elegir cualquier juego disponible.
- Las operaciones salen mezcladas entre suma, resta, multiplicacion y division.
- No hay logica matematica duplicada.

### Fase 8: Mini Juegos

Objetivo: construir juegos reutilizando una base comun de sesion, pregunta, progreso y feedback.

#### 8.1 Contrasena Secreta

Tareas:

- Crear `PasswordGameScreen`.
- Crear teclado numerico infantil.
- Mostrar operacion como reto.
- Permitir ingresar digitos y confirmar.
- Validar respuesta.
- Mostrar animacion de desbloqueo al acertar.
- Mostrar vibracion visual suave al fallar.

Criterios de aceptacion:

- El juego funciona con todas las operaciones.
- El feedback es claro y amable.
- Es visualmente atractivo y facil de usar.

#### 8.2 Encontrar El Tesoro

Tareas:

- Crear `TreasureGameScreen`.
- Mostrar mapa/camino infantil.
- Mostrar operacion arriba.
- Mostrar 2 a 4 caminos con respuestas.
- Animar avance del personaje al acertar.
- Mostrar trampa suave o mensaje amable al fallar.

Criterios de aceptacion:

- El juego funciona con todas las operaciones.
- El personaje avanza con respuestas correctas.
- La experiencia se siente como aventura, no examen.

#### 8.3 Laberinto

Tareas:

- Crear `MazeGameScreen`.
- Mostrar laberinto simple.
- Mostrar personaje y respuestas en esquinas.
- Permitir trazar linea con el dedo.
- Validar al tocar respuesta.
- Limpiar linea si falla.

Criterios de aceptacion:

- El laberinto no compite con la operacion matematica.
- El gesto funciona en Android e iOS.
- El feedback es positivo.

#### 8.4 Encontrar La Pareja

Tareas:

- Crear `MatchPairsGameScreen`.
- Mostrar 5 animales con operaciones.
- Mostrar 5 respuestas.
- Permitir unir operacion y respuesta.
- Dibujar linea durante el gesto.
- Marcar parejas correctas.
- Permitir reintentar parejas incorrectas.

Criterios de aceptacion:

- Las 5 parejas se resuelven correctamente.
- Las lineas y gestos funcionan en Expo.
- El juego es comprensible para ninos pequenos.

### Fase 9: Persistencia De Progreso

Objetivo: guardar sesiones y respuestas sin mezclar persistencia en pantallas.

Tareas:

- Implementar `gameSessionService`.
- Guardar sesion al finalizar juego.
- Guardar respuestas asociadas a la sesion.
- Guardar puntaje, correctas, incorrectas, modo, tipo de juego y operacion.
- Implementar fallback local si no hay Supabase.
- Crear `getGameHistory` basico.

Criterios de aceptacion:

- Cada juego guarda resultado.
- Las respuestas quedan asociadas a una sesion.
- El fallback local funciona sin Supabase.
- No hay llamadas directas a persistencia desde pantallas.

### Fase 10: Resultado Y Feedback

Objetivo: cerrar cada sesion con una experiencia positiva.

Tareas:

- Crear `GameResultScreen`.
- Mostrar mensaje positivo.
- Mostrar total de preguntas.
- Mostrar correctas e incorrectas.
- Mostrar puntaje.
- Mostrar estrellas o celebracion.
- Permitir jugar otra vez.
- Permitir volver al Home.

Criterios de aceptacion:

- El nino recibe celebracion aun si tuvo errores.
- El resultado es claro para el acudiente.
- Las acciones finales funcionan.

### Fase 11: QA, Documentacion Y Publicacion

Objetivo: preparar el MVP para uso real y publicacion futura.

Tareas:

- Ejecutar typecheck.
- Ejecutar lint si existe.
- Ejecutar Expo Doctor si esta disponible.
- Probar registro, login, consentimiento y onboarding.
- Probar Practicas por cada operacion.
- Probar Juegos en modo random.
- Probar persistencia con Supabase.
- Probar fallback sin variables de Supabase.
- Revisar pantallas en dispositivos pequenos.
- Revisar que no se pidan datos sensibles.
- Completar `docs/deployment.md`.
- Documentar dependencias agregadas.
- Documentar partes mockeadas o pendientes.

Criterios de aceptacion:

- La app corre en Android e iOS con Expo.
- No hay errores de TypeScript.
- La documentacion permite conectar Supabase.
- La app cumple criterios basicos de privacidad infantil.
- La experiencia visual es coherente y no generica.

## Historias De Usuario

- Como acudiente, quiero registrarme para crear un espacio seguro para mi hijo.
- Como acudiente, quiero aceptar un consentimiento para autorizar el uso de la app.
- Como acudiente, quiero crear un perfil infantil con datos minimos.
- Como nino, quiero ver mi nombre y una mascota amigable al entrar.
- Como nino, quiero elegir entre jugar o practicar.
- Como nino, quiero practicar una operacion y un numero especifico.
- Como nino, quiero jugar mini juegos con animales y retos visuales.
- Como nino, quiero recibir mensajes positivos cuando acierto.
- Como nino, quiero poder intentar de nuevo cuando me equivoco.
- Como acudiente, quiero que el progreso basico quede guardado.

## Criterios Globales De Aceptacion

- La app corre con Expo en Android e iOS.
- El proyecto usa TypeScript.
- Existe `.env.example`.
- Existe `database/schema.sql`.
- Existe `docs/deployment.md`.
- Existe cliente Supabase desacoplado.
- Existe fallback local si faltan variables de Supabase.
- El flujo de autenticacion funciona.
- El consentimiento es obligatorio y se guarda.
- El onboarding crea perfil infantil.
- El Home muestra el nombre del nino.
- Practicas permite seleccionar operacion y numero.
- Juegos permite seleccionar mini juego.
- El motor matematico respeta reglas por operacion.
- Los juegos validan respuestas correctamente.
- Las sesiones se guardan.
- No se guardan datos sensibles innecesarios de ninos.
- No se usa Supabase directamente en pantallas.
- No se usa AsyncStorage directamente en pantallas.
- La app tiene identidad visual infantil basada en animales tiernos.
- Las animaciones son suaves y no agresivas.
- Las librerias usadas son compatibles con Expo y publicacion.

## Riesgos

- Alcance demasiado grande para una sola iteracion.
- Juegos con gestos pueden tomar mas tiempo del esperado.
- RLS mal configurado podria exponer datos.
- La app puede terminar funcional pero visualmente generica.
- Dependencias visuales pesadas pueden complicar build y publicacion.
- El motor matematico puede generar preguntas incorrectas si no se valida bien.
- Fallback local puede divergir del comportamiento real de Supabase.
- Falta de pruebas en pantallas pequenas puede afectar usabilidad infantil.

## Mitigaciones

- Implementar por fases y validar cada una antes de avanzar.
- Priorizar Contrasena Secreta y Tesoro antes que juegos con gestos complejos.
- Probar `schema.sql` y RLS temprano en Supabase.
- Crear sistema visual antes de pantallas finales.
- Usar dependencias compatibles con Expo y agregar solo las necesarias.
- Validar el motor matematico con tests o scripts de verificacion.
- Mantener servicios con la misma interfaz para Supabase y fallback.
- Revisar manualmente la experiencia en pantallas pequenas.

## Checklist De Privacidad Infantil

- El nino no crea cuenta.
- El correo pertenece al acudiente.
- Se solicita consentimiento obligatorio.
- No se pide apellido del nino.
- No se pide foto del nino.
- No se pide telefono.
- No se pide direccion.
- No se pide ubicacion.
- No hay chat.
- No hay publicidad.
- No hay compras.
- No hay comunicacion con terceros.
- No se usan textos que generen miedo, culpa o presion.
- Los errores reciben feedback amable.

## Checklist De Publicacion Futura

- App corre en Expo sin errores criticos.
- Variables `.env` documentadas.
- Supabase configurado con RLS.
- Politica de privacidad preparada antes de publicar en tiendas.
- Descripcion de app clara para acudientes.
- Clasificacion de edad revisada.
- Sin tracking innecesario.
- Sin anuncios ni compras en MVP.
- Assets con licencia clara.
- App probada en Android real.
- App probada en iOS o simulador iOS.
- EAS Build documentado como siguiente paso.

## Definicion De Listo

La epica se considera lista cuando Maki+ permite que un acudiente registre la app, acepte consentimiento, cree el perfil del nino, y que el nino pueda practicar operaciones mediante una experiencia visual con animales tiernos, recibir feedback positivo, ver resultados y guardar progreso basico.

El MVP no debe considerarse listo si solo existen pantallas vacias, formularios genericos o juegos sin personalidad visual. El valor central de Maki+ es combinar practica matematica correcta con una experiencia infantil segura, grafica y motivadora.
