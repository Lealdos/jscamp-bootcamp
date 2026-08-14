<!-- Aquí puedes poner tus dudas sobre el ejercicio -->
Buenas por lo momentos no muchas dudas pero si una que el preguntarle a los LLM no me quedo claro.

INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (@id, @title, @company, @location, @description, @modality, @level)

      INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (?, ?, ?, ?, ?, ?, ?)

Hay alguna diferencia real en seguridad respecto hacerlo de la primera manera en vez de la segunda. segun lei en la primera manera la biblioteca con el @ igual sanetiza pero entonces no entiendo porque usar el ? en vez del @ si ese es mas facil de leer. en mi codigo use ambos para ver si es mejor usar uno u otro.

---

**Respuesta:** Hola! Muy buena pregunta.
No hay diferencia real de seguridad entre usar `@id`, `@title` (parámetros con nombre) y `?` (parámetros posicionales). Como dices, ambas evitan la inyección SQL.

La única diferencia es de estilo, cuando empezamos a hacer el ejercicio, no teníamos pensado al inicio que se vayan a manejar el número de parámetros que se maneja, por eso quedó de esa forma.

La realidad es que, para consultas con muchos parámetros, es mejor usar lo que hiciste, queda más claro, limpio y es mas mantenible en el tiempo.