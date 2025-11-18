<!-- Aquí puedes introducir tus dudas sobre el ejercicio, la consigna, la corrección, etc -->

Hola muchas gracias nuevamente por tomarse el tiempo de la correccion


No conocia el createDocumentFragment es un buen aporte gracias por eso.

Supongo que es del tipo de API que usan bibliotecas como react por debajo para optimizar cuando checkean el virtual dom y lo comparan con el dom real.


Tengo una duda y es que cuando hice el ejercicio yo aplique un split al sacar los valores del dataset.technology ya que en data.json podria existia la posibilidad de que fuese un arreglo de string es decir, un arreglo con los distintos tipos de tecnologia para el puesto existia la posibilidad de tener varias en el dataset.

en la correccion vi que fue removido, en los caso cuando son multiples tecnologias el filtro igual funcionara en esos casos?

---

## Respuesta

Hola José!
Uy, que bien que preguntaste, es algo importante y en la revisión se nos pasó.
El filtro funcionaría igual pero, lo correcto es como lo tenías antes, con el `split(',')`. Esto es por lo siguiente:

Si nosotros tenemos en el select una opción con valor `java`, y hacemos un .`includes()` sobre el dataset que viene como `java,python,javascript`, el resultado será `true` porque efectivamente `java` está incluido en la cadena.

Pero no será `true` solo porque `java` esté incluido, sino que también será `true` porque `java` está incluido en el texto `javascript`. Y esto no queremos que pase.

Por esa razón, hacer el `split(',')` y separar las tecnologías en una lista es lo mejor, porque nos permite hacer el `includes()` sobre una lista de tecnologías y no sobre una cadena de texto que no es precisa.

Agregamos la corrección en el archivo `filters.js` para que quede claro, excelente observación! Te felicito :)
en la correccion vi que fue removido, en los caso cuando son multiples tecnologias el filtro igual funcionara en esos casos?
