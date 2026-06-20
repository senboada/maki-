Actúa como un experto senior en desarrollo mobile con React Native, Expo, TypeScript, arquitectura frontend, Supabase, PostgreSQL, diseño infantil UX/UI, gamificación educativa y backend integration.

Necesito que implementes localmente una aplicación mobile para Android e iOS llamada **Maki+**.

Maki+ será una aplicación educativa infantil tipo juego, enfocada en niños y niñas de 4 a 10 años, cuyo objetivo es ayudarles a practicar y reforzar:

* Suma
* Resta
* Multiplicación
* División

La app debe sentirse como un juego arcade infantil, con animales, colores pastel, botones grandes, feedback positivo y una experiencia visual bonita para niños.

---

# Objetivo general

Crear un MVP funcional de Maki+ donde:

1. El padre, madre o acudiente pueda registrarse o iniciar sesión.
2. El adulto acepte un consentimiento obligatorio.
3. Se cree el perfil del niño o niña.
4. El niño pueda entrar al home.
5. El niño pueda elegir entre Juegos o Prácticas.
6. En Prácticas pueda seleccionar operación y número a reforzar.
7. En Juegos pueda seleccionar uno de 4 mini juegos.
8. Los mini juegos funcionen con suma, resta, multiplicación y división.
9. El progreso básico quede guardado en base de datos.
10. La app pueda correr tanto en Android como en iOS usando Expo.

---

# Nombre de la aplicación

La app se llama:

**Maki+**

Usar este nombre en:

* Splash o pantalla inicial
* Login
* Registro
* Home
* Mensajes principales
* Documentación
* Textos internos visibles

El tono de Maki+ debe ser:

* Infantil
* Amable
* Educativo
* Divertido
* Motivador
* Seguro

---

# Stack técnico requerido

Usar:

* React Native
* Expo
* TypeScript
* React Navigation
* Supabase como backend principal para el MVP
* PostgreSQL como base de datos
* Supabase Auth para autenticación
* Supabase Row Level Security para seguridad
* AsyncStorage solo como fallback local o caché
* Context API o Zustand para estado global
* Componentes reutilizables
* Arquitectura limpia por carpetas
* Variables de entorno con `.env`
* Documentación básica de despliegue gratuito

Evitar:

* Código monolítico
* Pantallas gigantes con toda la lógica adentro
* Lógica matemática duplicada
* Lógica de juegos duplicada
* Estilos improvisados por pantalla
* Textos adultos o técnicos para niños
* Pantallas sin diseño infantil
* Guardar datos sensibles innecesarios del niño
* Hardcodear credenciales
* Usar AsyncStorage como base de datos principal
* Crear una app visualmente básica o sin personalidad

---

# Prioridades del MVP

Primera prioridad:

* Que Maki+ funcione localmente con Supabase/PostgreSQL preparado.

Segunda prioridad:

* Si no existen todavía las variables de entorno de Supabase, la app debe funcionar en modo mock/local fallback sin romper la arquitectura.

Tercera prioridad:

* Que el diseño sea infantil, bonito y coherente.

Cuarta prioridad:

* Que los 4 mini juegos sean funcionales, aunque sus animaciones sean simples en la primera versión.

---

# Arquitectura esperada

Organiza el proyecto con una estructura similar a esta:

src/
app/
navigation/
AppNavigator.tsx
AuthNavigator.tsx
RootNavigator.tsx
providers/
AppProvider.tsx
AuthProvider.tsx
screens/
auth/
LoginScreen.tsx
RegisterScreen.tsx
ForgotPasswordScreen.tsx
onboarding/
ChildOnboardingScreen.tsx
home/
HomeScreen.tsx
practice/
PracticeMenuScreen.tsx
PracticeNumberSelectorScreen.tsx
PracticeGameSelectorScreen.tsx
games/
GamesMenuScreen.tsx
TreasureGameScreen.tsx
MatchPairsGameScreen.tsx
PasswordGameScreen.tsx
MazeGameScreen.tsx
GameResultScreen.tsx
components/
ui/
AppButton.tsx
AppCard.tsx
AppInput.tsx
ScreenContainer.tsx
ConsentDialog.tsx
game/
QuestionHeader.tsx
ProgressStars.tsx
AnswerOption.tsx
GameFeedback.tsx
child/
ChildAvatar.tsx
domain/
math/
mathGenerator.ts
mathTypes.ts
games/
gameTypes.ts
services/
supabaseClient.ts
authService.ts
parentProfileService.ts
childProfileService.ts
gameSessionService.ts
storage/
storageKeys.ts
storageClient.ts
theme/
colors.ts
typography.ts
spacing.ts
utils/

También crear:

database/
schema.sql

docs/
deployment.md

.env.example

---

# Backend y base de datos

La base de datos debe ser PostgreSQL.

Para el MVP usar Supabase como backend principal porque ofrece:

* PostgreSQL
* Auth
* API
* Row Level Security
* Free tier
* Integración sencilla con React Native

La arquitectura debe quedar desacoplada para que luego pueda migrarse a un backend propio si el MVP crece.

---

# Variables de entorno

Crear archivo:

.env.example

Con:

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

No hardcodear credenciales.

El cliente de Supabase debe leer esas variables desde Expo.

---

# Modelo inicial de base de datos

Crear archivo:

database/schema.sql

Debe incluir SQL para Supabase/PostgreSQL.

Tablas mínimas:

## parent_profiles

Campos:

* id uuid primary key
* user_id uuid references auth.users(id)
* email text
* consent_accepted boolean default false
* consent_accepted_at timestamptz nullable
* created_at timestamptz default now()
* updated_at timestamptz default now()

## child_profiles

Campos:

* id uuid primary key
* parent_id uuid references parent_profiles(id)
* name text
* age integer
* gender text
* reinforcement_topics text[]
* created_at timestamptz default now()
* updated_at timestamptz default now()

## game_sessions

Campos:

* id uuid primary key
* child_id uuid references child_profiles(id)
* mode text
* game_type text
* operation_type text nullable
* selected_number integer nullable
* total_questions integer
* correct_answers integer
* wrong_answers integer
* score integer
* started_at timestamptz
* finished_at timestamptz
* created_at timestamptz default now()

## game_answers

Campos:

* id uuid primary key
* game_session_id uuid references game_sessions(id)
* operation_type text
* left_number integer
* right_number integer
* operator_symbol text
* question_text text
* correct_answer integer
* selected_answer integer nullable
* is_correct boolean
* created_at timestamptz default now()

El SQL debe incluir:

* Primary keys
* Foreign keys
* Índices básicos
* created_at
* updated_at
* Función para actualizar updated_at
* Row Level Security
* Policies básicas para que cada acudiente solo pueda acceder a sus propios datos, a los perfiles de sus hijos y a las sesiones asociadas a esos hijos

---

# Seguridad y privacidad

Como Maki+ es una app para niños, cuidar especialmente:

* El correo debe pertenecer al padre, madre o acudiente.
* El niño no debe crear cuenta directamente.
* No pedir apellido del niño.
* No pedir foto del niño.
* No pedir dirección.
* No pedir teléfono.
* No pedir ubicación.
* No permitir chat libre.
* No permitir comunicación con terceros.
* No incluir publicidad en el MVP.
* No incluir compras dentro de la app en el MVP.
* No guardar datos sensibles innecesarios.
* Registrar el consentimiento del adulto.
* Mantener todos los textos seguros y aptos para niños.

Agregar comentarios o documentación breve explicando estas decisiones.

---

# Servicios esperados

Crear servicios separados.

No usar Supabase directamente dentro de las pantallas.

## services/supabaseClient.ts

Debe inicializar Supabase usando:

* EXPO_PUBLIC_SUPABASE_URL
* EXPO_PUBLIC_SUPABASE_ANON_KEY

Debe detectar si faltan variables y permitir fallback mock/local sin romper la app.

## services/authService.ts

Funciones:

* register(email, password)
* login(email, password)
* forgotPassword(email)
* logout()
* getCurrentUser()

Debe usar Supabase Auth si hay configuración.

Si no hay configuración, usar fallback mock/local.

## services/parentProfileService.ts

Funciones:

* getParentProfile()
* createParentProfile()
* acceptConsent()
* hasAcceptedConsent()

## services/childProfileService.ts

Funciones:

* getChildProfile()
* saveChildProfile()
* updateChildProfile()

## services/gameSessionService.ts

Funciones:

* saveGameSession()
* saveGameAnswers()
* getGameHistory()

---

# Flujo inicial de navegación

Implementar un bootstrap inicial que decida a dónde enviar al usuario.

Flujo esperado:

1. Si no hay usuario autenticado:

   * Login

2. Si hay usuario autenticado pero no aceptó consentimiento:

   * Mostrar consentimiento obligatorio

3. Si hay usuario autenticado, aceptó consentimiento, pero no existe perfil de niño:

   * ChildOnboardingScreen

4. Si todo existe:

   * HomeScreen

---

# Pantallas de autenticación

## LoginScreen

Campos:

* Correo
* Contraseña

Acciones:

* Iniciar sesión
* Ir a registro
* Ir a recuperar contraseña

Diseño:

* Mostrar marca Maki+
* Texto amigable para adultos
* Diseño infantil pero claro
* Botones grandes

## RegisterScreen

Campos:

* Correo
* Contraseña
* Confirmar contraseña

Validaciones:

* Correo requerido
* Contraseña requerida
* Confirmación debe coincidir

Después del registro exitoso:

* Crear perfil de acudiente si aplica
* Mostrar diálogo obligatorio de consentimiento

## ForgotPasswordScreen

Campo:

* Correo

Acción:

* Enviar instrucciones

Mensaje:

* “Si el correo existe, enviaremos instrucciones para recuperar la contraseña.”

---

# Diálogo de consentimiento obligatorio

Después del registro o primer login exitoso si no se ha aceptado, mostrar un modal/dialog obligatorio.

Texto sugerido:

“Esta aplicación está diseñada para niños y niñas entre 4 y 10 años. Como padre, madre o acudiente, confirmo que entiendo que las actividades, contenidos y acciones dentro de Maki+ están limitadas a ejercicios educativos infantiles. También confirmo que soy responsable del acompañamiento y uso de la aplicación por parte del niño o niña.”

Botones:

* Acepto y continuar

Reglas:

* No permitir continuar sin aceptar.
* Guardar en parent_profiles:

  * consent_accepted = true
  * consent_accepted_at = now()

---

# Onboarding del niño

Pantalla:

ChildOnboardingScreen

Mostrar diseño infantil.

Preguntar:

* Nombre del niño o niña
* Edad
* Género:

  * Niña
  * Niño
  * Prefiero no decirlo
* Qué quiere reforzar:

  * Suma
  * Resta
  * Multiplicación
  * División

La selección de temas a reforzar debe ser múltiple.

Validaciones:

* Nombre requerido
* Edad requerida
* Edad entre 4 y 10
* Debe seleccionar al menos un tema a reforzar

Después de guardar:

* Crear child_profile
* Ir al Home

---

# Home

Pantalla:

HomeScreen

Debe mostrar:

“Bienvenido/a, {nombreDelNiño}”

Debajo mostrar dos tarjetas grandes, divertidas, tipo cajones o cofres:

1. Juegos
2. Prácticas

Diseño:

* Infantil
* Animales
* Colores pastel
* Botones grandes
* Mucho espacio
* Visualmente bonito

Acciones:

* Juegos lleva a GamesMenuScreen
* Prácticas lleva a PracticeMenuScreen

---

# Flujo de prácticas

## PracticeMenuScreen

Mostrar 4 opciones:

* Sumar
* Restar
* Multiplicar
* Dividir

Cada una como tarjeta infantil grande.

Al seleccionar una operación:

* Navegar a PracticeNumberSelectorScreen

## PracticeNumberSelectorScreen

Dependiendo de la operación seleccionada, preguntar con qué número quiere practicar.

### Multiplicación

Mostrar números del 1 al 10.

Si el niño elige 7:

* Generar preguntas de la tabla del 7
* Ejemplos:

  * 7 x 1
  * 7 x 8
  * 7 x 3

Las preguntas deben salir en orden aleatorio, no secuencial.

### Suma

Mostrar números del 1 al 20.

El número seleccionado debe estar siempre como uno de los sumandos.

Ejemplo si elige 8:

* 8 + 4
* 2 + 8
* 8 + 15

### Resta

Mostrar números del 1 al 20.

El número seleccionado debe ser el sustraendo.

Reglas:

* Minuendo mayor al sustraendo.
* Resultado no negativo.
* Minuendo menor a 100.

Ejemplo si elige 7:

* 20 - 7
* 35 - 7
* 9 - 7

### División

Mostrar números del 1 al 10.

El número seleccionado debe ser el divisor.

Reglas:

* Dividendo mayor al divisor.
* Dividendo menor a 100.
* División exacta.
* Resultado entero.

Ejemplo si elige 5:

* 25 / 5
* 40 / 5
* 10 / 5

Después de seleccionar número:

* Navegar a PracticeGameSelectorScreen

## PracticeGameSelectorScreen

Mostrar los 4 juegos:

1. Encontrar el tesoro
2. Encontrar la pareja
3. Contraseña secreta
4. Laberinto

Al seleccionar uno:

* Iniciar juego en modo practice
* Enviar:

  * operation
  * selectedNumber
  * totalQuestions

---

# Flujo de Juegos

## GamesMenuScreen

Mostrar los 4 juegos:

1. Encontrar el tesoro
2. Encontrar la pareja
3. Contraseña secreta
4. Laberinto

En este modo:

* El niño elige el juego.
* Las operaciones salen aleatoriamente entre:

  * Suma
  * Resta
  * Multiplicación
  * División

No se selecciona número específico.

---

# Motor matemático

Crear:

domain/math/mathTypes.ts

Con tipos:

OperationType:

* addition
* subtraction
* multiplication
* division

MathQuestion:

* id
* operation
* leftNumber
* rightNumber
* operatorSymbol
* questionText
* correctAnswer
* options

Crear:

domain/math/mathGenerator.ts

Funciones:

* generateMathQuestion(config)
* generatePracticeQuestions(operation, selectedNumber, count)
* generateRandomMixedQuestions(count)
* generateAnswerOptions(correctAnswer, minOptions, maxOptions)

Reglas:

* Las preguntas no deben ser secuenciales.
* Las preguntas deben mezclarse.
* Las opciones incorrectas deben ser cercanas al resultado real.
* Las opciones incorrectas no deben repetir la correcta.
* Mostrar entre 2 y 4 opciones según el juego.
* Evitar resultados negativos.
* Evitar divisiones con decimales.
* Para multiplicación, practicar tablas del 1 al 10.
* Para resta, el minuendo siempre debe ser mayor al sustraendo.
* Para división, el dividendo debe ser mayor al divisor y menor a 100.
* En práctica, respetar siempre el número seleccionado por el niño.

---

# Configuración común de juegos

Crear:

domain/games/gameTypes.ts

Tipos:

GameType:

* treasure
* match_pairs
* password
* maze

GameMode:

* practice
* random

GameSessionConfig:

* mode
* gameType
* operation opcional
* selectedNumber opcional
* totalQuestions

Cada juego debe:

* Recibir GameSessionConfig
* Generar preguntas según el modo
* Mostrar progreso
* Validar respuestas
* Mostrar feedback
* Guardar sesión al finalizar
* Guardar respuestas al finalizar
* Permitir volver al Home
* Permitir salir del juego

---

# Mini juego 1: Encontrar el tesoro

Pantalla:

TreasureGameScreen

Concepto:

* Pantalla vertical.
* Personaje infantil, como un animal explorador.
* El personaje avanza y se detiene en el centro.
* En la parte superior se muestra la operación.
* Abajo se muestran de 2 a 4 caminos.
* Encima de cada camino aparece una posible respuesta.
* El niño toca el camino que cree correcto.

Comportamiento:

Si acierta:

* Mostrar animación alegre.
* El personaje avanza.
* Pasar a la siguiente pregunta.

Si falla:

* Mostrar animación suave de trampa, sin asustar.
* Mostrar mensaje positivo:

  * “Casi, inténtalo otra vez”
  * “Buen intento”
* Permitir reintentar o pasar a otra pregunta según sea más simple para el MVP.

Diseño:

* Estilo mapa del tesoro infantil.
* Cofres.
* Caminos.
* Árboles.
* Piedras.
* Estrellas.
* Animales bonitos.
* Colores amigables.

---

# Mini juego 2: Encontrar la pareja

Pantalla:

MatchPairsGameScreen

Concepto:

* A la izquierda se muestran 5 caras de animales animados en columna.
* Cada animal representa una operación.
* Inicialmente la operación está cubierta por la cara del animal.
* Solo se descubre una operación a la vez.
* A la derecha se muestran 5 respuestas descubiertas en columna.
* El niño debe unir la operación con su resultado correcto deslizando el dedo desde la operación hasta la respuesta.

Comportamiento:

* Mientras el niño arrastra, dibujar una línea siguiendo el dedo.
* Si une correctamente:

  * Mantener la línea o marcar como resuelto.
  * Mostrar feedback positivo.
  * Descubrir la siguiente operación.
* Si une incorrectamente:

  * Mostrar feedback suave.
  * Borrar la línea.
  * Permitir reintentar.

Finaliza cuando las 5 operaciones estén emparejadas.

Diseño:

* Caras de animales tiernos.
* Líneas de colores.
* Respuestas en burbujas.
* Respuestas en tarjetas.
* Animaciones suaves.

Nota técnica:

* Implementar el trazado con PanResponder, Gesture Responder, react-native-svg o una solución compatible con Expo.
* Si react-native-svg no está instalado, instalarlo y documentar el comando.

---

# Mini juego 3: Contraseña secreta

Pantalla:

PasswordGameScreen

Concepto:

* Emular una pantalla de bloqueo numérica de celular.
* En la parte superior aparece la operación.
* El resultado de la operación es la contraseña.
* El niño debe digitar los números en orden y luego presionar OK.

Ejemplo:

Operación:

20 + 9

Contraseña:

29

El niño debe tocar:

2, luego 9, luego OK.

Diseño:

* Pantalla tipo celular infantil.
* Botones grandes del 0 al 9.
* Botón borrar.
* Botón OK.
* Indicador visual de dígitos ingresados.
* Animación de desbloqueo.

Comportamiento:

Si falla:

* Emular vibración visual.
* Usar Vibration de React Native si está disponible.
* Mostrar error amable:

  * “Ups, prueba otra vez”

Si acierta:

* Mostrar animación de desbloqueo.
* Pasar a la siguiente operación.

Al completar todas las operaciones:

* Mostrar pantalla:

  * “¡Lo lograste!”

---

# Mini juego 4: Laberinto

Pantalla:

MazeGameScreen

Concepto:

* En la parte superior aparece la operación.
* Debajo hay un cuadrado tipo laberinto simple.
* En la esquina superior izquierda aparece el personaje.
* En las otras 3 esquinas aparecen respuestas posibles.
* Una respuesta es correcta.
* Las otras son incorrectas.
* El niño debe trazar una línea con el dedo desde el personaje hasta la respuesta.

Comportamiento:

* Mientras arrastra el dedo, pintar la línea.
* Validar cuando la línea toque una respuesta.
* Si es correcta:

  * Mostrar animación positiva.
  * Pasar a la siguiente pregunta.
* Si es incorrecta:

  * Mostrar mensaje amable.
  * Limpiar la línea.
  * Permitir intentar otra vez o pasar a una nueva pregunta.

Diseño:

* Laberinto muy simple.
* No hacerlo difícil.
* Animales.
* Flores.
* Estrellas.
* Piedras.
* Foco en la operación, no en la dificultad del laberinto.

---

# Reglas comunes para los 4 juegos

Todos los juegos deben:

* Funcionar con suma, resta, multiplicación y división.
* Mostrar pregunta actual / total.
* Mostrar feedback positivo.
* No castigar agresivamente los errores.
* Usar textos cortos y motivadores.
* Guardar resultados.
* Finalizar con pantalla de resultado.
* Permitir volver al Home.

Mensajes sugeridos:

* “¡Muy bien!”
* “¡Súper!”
* “¡Excelente!”
* “Casi, inténtalo otra vez”
* “¡Lo estás haciendo genial!”
* “¡Ganaste una estrella!”
* “¡Misión completada!”
* “¡Lo lograste!”

---

# Pantalla de resultado

Crear:

GameResultScreen

Debe mostrar:

* Mensaje positivo
* Total de preguntas
* Respuestas correctas
* Respuestas incorrectas
* Puntaje
* Botón volver al Home
* Botón jugar otra vez

Diseño:

* Infantil
* Celebración visual
* Estrellas
* Confeti simple o elementos alegres si es posible

---

# Persistencia

Principal:

* Supabase/PostgreSQL

Fallback:

* AsyncStorage si no hay variables de entorno

Guardar:

* Usuario autenticado
* Perfil del acudiente
* Consentimiento aceptado
* Perfil del niño
* Temas seleccionados
* Sesiones de juego
* Respuestas por sesión
* Puntaje

No mezclar persistencia directamente en pantallas.

---

# Diseño UI/UX infantil

El diseño es una parte muy importante del MVP.

Usar:

* Colores pastel
* Bordes redondeados
* Tarjetas grandes
* Botones grandes
* Tipografía amigable
* Animales tiernos
* Iconos grandes
* Feedback visual positivo
* Pantallas limpias
* Poco texto
* Instrucciones cortas
* Elementos tipo arcade infantil
* SafeAreaView
* KeyboardAvoidingView en formularios

Evitar:

* Interfaz adulta
* Colores oscuros dominantes
* Textos largos para niños
* Castigos visuales fuertes
* Sonidos o feedback agresivo
* Formularios complejos para el niño
* Elementos pequeños difíciles de tocar

---

# Tema visual sugerido

Crear archivos:

theme/colors.ts
theme/typography.ts
theme/spacing.ts

Paleta sugerida:

* Fondo principal pastel claro
* Azul suave
* Verde menta
* Amarillo suave
* Coral suave
* Morado pastel

No es obligatorio usar exactamente estos colores, pero el resultado debe ser coherente e infantil.

---

# Accesibilidad y experiencia

Considerar:

* Botones grandes para dedos pequeños.
* Buen contraste.
* Lectura simple.
* Textos cortos.
* Espaciado amplio.
* Soporte para pantallas pequeñas.
* Soporte vertical principalmente.
* SafeAreaView.
* KeyboardAvoidingView.
* Evitar elementos muy pequeños.
* Feedback visual claro.

---

# Documentación de despliegue gratuito

Crear:

docs/deployment.md

Debe explicar cómo montar el MVP gratis o con free tier usando Supabase:

1. Crear proyecto en Supabase.
2. Copiar Supabase URL.
3. Copiar Supabase anon key.
4. Crear archivo `.env`.
5. Ejecutar el SQL de `database/schema.sql`.
6. Correr la app con Expo.
7. Probar registro.
8. Probar consentimiento.
9. Probar onboarding.
10. Probar guardado de sesiones.

También indicar opciones futuras:

* EAS Build para Android/iOS.
* Backend propio con Node.js si el MVP crece.
* Neon + Render como alternativa.
* Supabase Storage si luego se agregan avatares o recursos.

---

# Comandos esperados

Al finalizar, indicar cómo correr:

npm install
npx expo start

Si agrega dependencias, explicar cuáles.

Si usa react-native-svg, indicar instalación.

Si usa Zustand, indicar instalación.

---

# Criterios de aceptación

La implementación se considera correcta si:

1. La app corre en Android e iOS con Expo.
2. El proyecto usa TypeScript.
3. Existe estructura limpia por carpetas.
4. Existe `.env.example`.
5. Existe `database/schema.sql`.
6. Existe `docs/deployment.md`.
7. Existe cliente Supabase desacoplado.
8. Existe fallback local si faltan variables Supabase.
9. El flujo de autenticación funciona.
10. El usuario no puede entrar sin aceptar consentimiento.
11. El consentimiento se guarda.
12. La app detecta si falta perfil del niño.
13. El onboarding crea el perfil del niño.
14. El Home muestra el nombre del niño.
15. Desde Prácticas puedo seleccionar suma, resta, multiplicación o división.
16. Desde Prácticas puedo seleccionar el número a reforzar.
17. La multiplicación respeta la tabla elegida.
18. La suma incluye el número elegido como uno de los sumandos.
19. La resta usa el número elegido como sustraendo y evita negativos.
20. La división usa el número elegido como divisor y genera divisiones exactas.
21. Desde Juegos puedo elegir cualquiera de los 4 juegos.
22. En modo Juegos las operaciones salen mezcladas aleatoriamente.
23. Los 4 mini juegos funcionan con todas las operaciones.
24. Las respuestas correctas se validan correctamente.
25. Las opciones incorrectas no repiten la respuesta correcta.
26. El resultado del juego se guarda.
27. El diseño es infantil, bonito, claro y consistente.
28. No hay lógica matemática duplicada.
29. No se usa Supabase directamente dentro de pantallas.
30. No se usa AsyncStorage directamente dentro de pantallas.
31. No se guardan datos sensibles innecesarios de niños.

---

# Forma de trabajo esperada

Antes de modificar o crear archivos:

1. Revisa la estructura actual del proyecto.
2. Identifica si ya existe navegación, theme, storage, servicios o Supabase.
3. No rompas lo existente.
4. Si el proyecto está vacío o básico, crea la estructura necesaria.
5. Implementa primero arquitectura base.
6. Luego implementa Supabase client y fallback.
7. Luego implementa autenticación.
8. Luego implementa consentimiento.
9. Luego implementa onboarding.
10. Luego implementa home.
11. Luego implementa motor matemático.
12. Luego implementa prácticas.
13. Luego implementa menú de juegos.
14. Luego implementa los 4 mini juegos.
15. Luego implementa guardado de sesiones.
16. Luego implementa documentación.
17. Finalmente revisa errores de TypeScript, navegación y ejecución.

Al finalizar:

* Ejecuta typecheck si existe.
* Ejecuta lint si existe.
* Ejecuta expo-doctor si está disponible.
* Indica qué archivos creaste o modificaste.
* Indica cómo correr la app.
* Indica qué partes quedaron mockeadas.
* Indica cómo conectar Supabase.
* Indica próximos pasos recomendados.

---

# Importante

No quiero solo pantallas vacías.

Necesito una primera versión funcional y visualmente agradable.

Prioriza que el niño pueda:

1. Entrar a Maki+.
2. Tener su perfil.
3. Elegir practicar.
4. Elegir una operación.
5. Elegir un número.
6. Elegir un juego.
7. Jugar.
8. Recibir feedback positivo.
9. Ver resultado.
10. Guardar su progreso básico.

Mantén el código simple, escalable y claro.
