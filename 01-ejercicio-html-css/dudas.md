<!-- Aquí puedes poner las dudas de la corrección o del ejercicio -->

Hola maadeval o cualquiera del equipo de midu que vea esto tengo solo dos preguntas sobre las correcciones agradezco de ante mano el tiempo por la revision y los consejos.

1 - En el commit (https://github.com/Lealdos/jscamp-bootcamp/pull/1/commits/a0894c6128a879160563cb5440b3a85aa80cf7bf ) Standardized spacing around combinators (>, +) and pseudo-classes		
 es estandar eb css que los simbolos para combiner clases o pseudo-clases se escriban sin separacion o es ya son estandares del equipo de midudev? (hago esta pregunta con ya que no sabia si era un extandar y asi estar mucho mas pendiente en el futuro)

2 -  En el commit(https://github.com/Lealdos/jscamp-bootcamp/pull/1/commits/cccc90a7979e206c3d6e1c60ee6474633ff874dd) Added aria-label and title attributes to pagination navigation for screen reader support

A todos los SVG se les deberia colocar el arial lebel solo cuando no tienen al lado algun texto que diga que es? por ejemplo en este caso que estan dentro de una anchor pero no hay nada escrito que diga por ejemplo "siguiente" antes o despues del svg lo correcto es ponerle un arial label correcto? pero en caso contrario, es decir, que si tenga un texto al lado del svg que especifique que es el arial label es redundante?

-- 

## Respuestas

**1- Primera pregunta**
Hola genio! Muy buena observación!
Podes escribirlo de las dos maneras, ambas funcionan igual y la única diferencia es lo visual. 
En donde si cambian los espacios es cuando hacemos cosas como estas:

```css
/* Esto indica que queremos estilar la clase .item que está dentro de la clase .box */
.box .item { /* ... */}

/* Esto indica que queremos estilar el elemento que tenga la clase .box y .item al mismo tiempo */
.box.item { /* ... */}
```

En el commit se quitaron los espacios no porque quisieramos, sino que fue nuestro VSCode al formatear el código 😅

**2- Segunda pregunta**

El aria-label, más que ir colocado en un `svg`, va colocado en un elemento que tenga una intención y no haya un texto que lo describa.

Vamos a explicar esto con varios ejemplos que es importante:

```html
 <a href="#" aria-label="Ir a la página de resultados siguiente" title="Ir a la página de resultados siguiente">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 6l6 6l-6 6" />
  </svg>
</a>
```

El HTML que pegué arriba es el del anchor de ir a la siguiente página.

Si nosotros vemos la web, entendemos que ese link es para ir a la clase siguiente por su svg, y su contexto visual (estar al lado de los números de página)

Esto funciona bien porque lo estamos viendo, pero qué pasa si somos google (el robot que inspecciona las páginas web), o no podemos ver la web y tenemos que guiarnos a partir de un lector de pantalla?

En estos casos, no nos podemos guiar por el contexto visual. Así que tenemos que usar otros recursos.

Voy a poner el mismo ejemplo que puse arriba pero con texto:

```html
 <a href="#" aria-label="Ir a la página de resultados siguiente" title="Ir a la página de resultados siguiente">
  Ir a la página siguiente
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 6l6 6l-6 6" />
  </svg>
</a>
```

Los lectores de pantalla cuando lean el documento, ya no se encontrarán con un anchor que tiene un svg, sino con un anchor que te "lleva a la página siguiente".

Este es el motivo por el cual se usa `aria-label` y porque no es necesario cuando la acción ya queda explicada por el texto que acompaña al elemento.

Todas estas cuestiones son de accesibilidad y dependiendo el caso, de SEO.

No solo creamos páginas para usuarios que pueden verlas, sino para robots que la puedan leer y navegar en ellas.

**Otro ejemplo: las imágenes.**

```html
<img src="logo.png" alt="Logo de la empresa" width="16" height="16" />
```

El atributo `alt` es el que describe la imagen, por lo que no es necesario agregar un `aria-label`.

`aria-label` es un atributo que se usa para dar un nombre a un elemento que no tiene texto que lo describa. En este caso, las imágenes ya tienen un atributo `alt` que sirve para eso, dar contexto de lo que es la imagen.

Te menciono este otro ejemplo para que veas que es un tema de accesibilidad, todo lo que no pueda ser visto y no tenga algo que lo explique, necesita atributos para ello, y HTML nos da `aria-label`, `alt`, y otras más para cada caso.

Si quedó alguna otra duda nos podemos comentar si? Estamos para eso.
Es un tema entreverado, así que no te preocupes si con este ejemplo no quedó