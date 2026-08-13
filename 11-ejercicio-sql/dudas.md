<!-- Aquí puedes poner tus dudas sobre el ejercicio -->
Buenas por lo momentos no muchas dudas pero si una que el preguntarle a los LLM no me quedo claro.

INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (@id, @title, @company, @location, @description, @modality, @level)

      INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (?, ?, ?, ?, ?, ?, ?)

Hay alguna diferencia real en seguridad respecto hacerlo de la primera manera en vez de la segunda. segun lei en la primera manera la biblioteca con el @ igual sanetiza pero entonces no entiendo porque usar el ? en vez del @ si ese es mas facil de leer. en mi codigo use ambos para ver si es mejor usar uno u otro.