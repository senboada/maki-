**Problemática**

Actualmente, los niños están presentando dificultades para repasar y practicar operaciones matemáticas básicas como suma, resta, multiplicación y división. Este problema se vuelve más evidente en temas como las multiplicaciones, donde gran parte del aprendizaje depende de la memoria y la repetición constante. Aunque operaciones como la suma, la resta y la división tienen procesos más lógicos, también requieren práctica frecuente para que los niños puedan reconocer patrones, mejorar su agilidad mental y resolver ejercicios con mayor seguridad.

El inconveniente principal es que el repaso tradicional puede sentirse repetitivo, aburrido o poco motivador para los niños. Esto hace que sea difícil mantener su atención durante el tiempo suficiente para reforzar los conocimientos. Además, cuando la práctica se percibe como una obligación escolar, los niños pueden perder interés rápidamente, especialmente si no reciben retroalimentación positiva o si sienten que equivocarse es algo negativo.

Por esta razón, se necesita una solución que transforme la práctica matemática en una experiencia más divertida, visual e interactiva. La idea no es solo mostrar ejercicios en pantalla, sino convertir el aprendizaje en una dinámica de juego donde el niño pueda practicar muchas veces sin sentir que está haciendo una tarea tradicional.

**Idea**

La idea es crear una aplicación móvil llamada **Maki+**, diseñada para niños y niñas entre 4 y 10 años, que ayude a reforzar suma, resta, multiplicación y división mediante mini juegos educativos. La aplicación debe funcionar como una experiencia infantil tipo arcade, con colores llamativos pero suaves, animales, personajes amigables, botones grandes, mensajes positivos y una navegación sencilla para que los niños puedan usarla con facilidad.

Maki+ tendrá dos formas principales de uso: **Prácticas** y **Juegos**. En la sección de Prácticas, el niño podrá elegir qué operación quiere reforzar y con qué número desea practicar. Por ejemplo, si selecciona multiplicación y el número 7, la app generará ejercicios aleatorios de la tabla del 7. Si selecciona suma, resta o división, la aplicación generará ejercicios respetando reglas específicas para que el número elegido haga parte de la operación y los resultados sean adecuados para su edad.

En la sección de Juegos, el niño podrá elegir entre diferentes mini juegos, como encontrar un tesoro, unir parejas, desbloquear una contraseña o resolver un laberinto. En este modo, las operaciones aparecerán de forma aleatoria entre suma, resta, multiplicación y división. El objetivo es que el niño practique sin sentir que está en una evaluación, sino dentro de una aventura divertida donde cada respuesta correcta le permite avanzar, desbloquear algo o completar una misión.

La aplicación también debe incluir un flujo para padres o acudientes, con registro, inicio de sesión, recuperación de contraseña y aceptación de un consentimiento donde se indique que Maki+ es una app infantil orientada a niños de 4 a 10 años. Luego, en el primer uso, se debe crear el perfil del niño o niña con datos básicos como nombre, edad, género y temas que necesita reforzar. Esta información permitirá personalizar la experiencia y mostrar un home con un mensaje de bienvenida usando el nombre del niño.

A nivel técnico, Maki+ será una app móvil desarrollada en React Native con Expo, compatible con Android e iOS. Para el MVP, se busca usar PostgreSQL mediante Supabase, aprovechando su free tier para guardar usuarios, perfiles de niños, consentimiento del acudiente, sesiones de juego, respuestas y progreso básico. La arquitectura debe quedar preparada para crecer en el futuro, pero manteniendo una primera versión funcional, simple y escalable.
