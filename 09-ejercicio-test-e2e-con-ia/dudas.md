<!-- Puedes poner tus dudas aquí -->

Me explicaste que es preferible usar Regex en vez de los string. eso me genero una duda que realmente es en ambos casos. es buena idea que sean case sensitive o hacerlo explicito (pregunto porque no se si debo ser super especifico ya que es un test)?

**Respuesta:**

Los tests siempre es mejor hacerlo case insensitive, por eso usamos regex `/texto/i`, la idea de esto es:
- No dejamos de ser específicos
- Si cambiamos una mayúscula, o alguna parte de la oración, no se nos va a romper el test.

La idea es poder hacer tests que sean mantenibles, escalables y que mejoren la accesibilidad. Por eso lo que recomendamos es usar `getByRole`, esa forma de capturar elementos nos obliga a usar correctamente la semántica HTML, y por ende ser accesibles.


por lo que entiendo un cambio grande o mejor dicho la buena practica es que nuestro html tenga siempre sea significativo un arial label para asi aplicar los test de manera mas directa correcto? digamos que por prioridad seria de las mas altas a la hora de buscar como identificar una parte del html para el test cuando es algo unico?

      cuando deberia usar el getByRole y cuando el locator?

**Respuesta:**

El orden es:
- getByRole (siempre que el elemento tenga un rol accesible, la idea es hacerlo accesible nosotros si no lo es)
- getByLabelText (aria-label / label asociado)
- getByText / getByPlaceholderText
- locator() / getByTestId (último recurso)

`getByRole` lo usas cuando el elemento tiene un rol semántico (botón, link, heading, textbox, etc.). Es el más recomendado porque simula cómo un usuario real interactúa con la página.
`locator()` se usa cuando no hay rol claro o necesitas algo muy específico (un div sin semántica, un selector CSS complejo, etc.). Es el comodín, pero es más frágil y no se recomienda usar, porque no te obliga a mejorar la accesibilidad y por otro lado, es muy variable, porque si cambias el orden de tu HTML y tus clases de CSS, se va a romper.