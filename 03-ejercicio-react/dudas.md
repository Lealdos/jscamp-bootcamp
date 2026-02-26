# Aquí puedes dejar tus dudas

## Primera parte

<!-- Dudas de la primera parte del ejercicio -->

## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->

## Tercera parte

<!-- Dudas de la tercera parte del ejercicio -->

## Cuarta parte

<!-- Dudas de la cuarta parte del ejercicio -->

## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->

## Sexta parte

<!-- Dudas de la sexta parte del ejercicio -->

## Séptima parte

<!-- Dudas de la séptima parte del ejercicio -->

## Ejercicio extra

Por lo momentos no se me ocurrió ninguna duda. quizás son las correcciones eso cambie quedo a la espera gracias.

Buenas gracias por la corrección, tengo solo 2 dudas.

1- cuando en la pagina/componente search sacas las funciones para y explicas que es para mayor legibilidad. ¿Mi duda es si solo fue por legibilidad o también eso afectaría al rendimiento ya que se están tomando elementos fuera del virtual DOM de react? al leer eso me hizo pensar su fue solo eso u también había otra cosa.

const createAndSetParamIfExist = () => {
const params = new URLSearchParams(window.location.search);

    const setParam = (key, value) => {
        if (value) params.set(key, value);
        else params.delete(key);
    };

    return {
        params,
        setParam
    }

}
^
este pedazo de cogido que agregaste no lo entendi muy bien use IA para que me explicara pero quede bastante igual aunque entiendo lo que hace no entiendo como funciona al ser aplicado. para setear los parametros

2 - en la correction del componente
SearchFormSection.jsx no es siempre recomendable tener un id y un name para control

---

## Respuestas:

1. Te referís a `getInitialFilters`, `getInitialTextToFilter` y `getInitialCurrentPage`? No afecta el rendimiento dejarlo dentro del useState o sacarlo para afuera. Lo que hace es que al leer el componente de arriba hacia abajo se pueda seguir una lectura más rápida sin tener que ver tanto código.

Mira, dejo los dos ejemplos:

```jsx
// ANTES
const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
        technology: params.get('technology') || '',
        location: params.get('type') || '',
        experienceLevel: params.get('level') || '',
    };
});

const [textToFilter, setTextToFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('text') || '';
});

const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');

    if (!pageParam) return 1;

    const page = Number(pageParam);

    if (Number.isNaN(page) || page < 1) {
        return 1;
    }
    console.log('Página inicial desde URL:', page);
    return page;
});
```

```jsx
// DESPUES
const [filters, setFilters] = useState(getInitialFilters());
const [textToFilter, setTextToFilter] = useState(getInitialTextToFilter());
const [currentPage, setCurrentPage] = useState(getInitialCurrentPage());
```

El `DESPUES` es más limpio y fácil de leer. Ignoramos la lógica que tiene cada useState y nos enfocamos en lo que necesitamos.

Si queremos luego ver que hace cada uno, podemos ir a las funciones separadas y ver su lógica.

**Conclusión:**
Cuando trabajamos con componentes en React, uno de los pilares a seguir es ser `declarativos`. Esto significa que el código se debe explicar por si mismo sin tener que leer lógicas complejas para saber lo que hace un componente. Similar al porqué de usar Custom Hooks.

Si vemos el `DESPUES`, es totalmente declarativo. Cuando empezamos a leer el componente de arriba hacia abajo, sabemos con esta lectura que hay 3 estados que vamos a trabajar. No importa cómo se obtiene el valor inicial y cual es la lógica detrás de cada uno, lo que importa es entender que esos son los estados que vamos a trabajar.

2. Vamos por partes:

Antes teníamos esto:

```jsx
const params = new URLSearchParams();
params.set('limit', JOBS_PER_PAGE);
params.set('offset', (currentPage - 1) * JOBS_PER_PAGE);

if (debouncedTextToFilter)
    params.set('text', debouncedTextToFilter);
if (filters.technology)
    params.set('technology', filters.technology);
if (filters.location)
    params.set('type', filters.location);
if (filters.experienceLevel)
    params.set('level', filters.experienceLevel);
```

Lo que hace ese código es crear un objeto `URLSearchParams` y luego agregarle los parámetros que necesitamos.

```jsx
const params = new URLSearchParams(); // <- Crea un objeto URLSearchParams
```

Y luego agrega los parámetros que necesitamos:

```jsx
params.set('limit', JOBS_PER_PAGE);
params.set('offset', (currentPage - 1) * JOBS_PER_PAGE);

if (debouncedTextToFilter)
    params.set('text', debouncedTextToFilter);
if (filters.technology)
    params.set('technology', filters.technology);
if (filters.location)
    params.set('type', filters.location);
if (filters.experienceLevel)
    params.set('level', filters.experienceLevel);
```

Hasta aquí vamos genial y no hay ningún problema en el código :) pero podemos hacer algo para que no hayan tantos `if` uno debajo de otro:

Lo que hacemos aquí:

```jsx
if (debouncedTextToFilter)
    params.set('text', debouncedTextToFilter);
```

Es evaluar si `debouncedTextToFilter` tiene un valor y si es así, agregarlo al objeto `params`.

Lo que podemos hacer es crear una función que haga eso por nosotros de una manera genérica: Pasando cualquier valor, y si existe, agregarlo al objeto `params`.

```jsx
const funcionParaNoRepetirIf = (key, value) => {
    if (value)
        params.set(key, value);
}
```

Lo que hace esto es evaluar si el valor que pasamos existe, y si es así, agregarlo al objeto `params` con el nombre que le pasemos como primer parámetro.

Quedaría algo tal que así:

```jsx
funcionParaNoRepetirIf('text', debouncedTextToFilter);
funcionParaNoRepetirIf('technology', filters.technology);
funcionParaNoRepetirIf('type', filters.location);
funcionParaNoRepetirIf('level', filters.experienceLevel);
```

Si vemos el código completo, quedaría algo así:

```jsx
const params = new URLSearchParams();

const funcionParaNoRepetirIf = (key, value) => {
    if (value)
        params.set(key, value);
}

funcionParaNoRepetirIf('text', debouncedTextToFilter);
funcionParaNoRepetirIf('technology', filters.technology);
funcionParaNoRepetirIf('type', filters.location);
funcionParaNoRepetirIf('level', filters.experienceLevel);
```

Ahora, ya que `funcionParaNoRepetirIf` es una función que se encarga de agregar parámetros a un objeto `URLSearchParams`, en vez de trabajar con un `params` que viene de afuera, se lo podemos agregar adentro:

```jsx
const funcionParaNoRepetirIf = (key, value) => {
    const params = new URLSearchParams();
    if (value)
        params.set(key, value);

    return params;
}
```

De esta manera, no tenemos que llamar `const params = new URLSearchParams();` dentro del useEffect.

Quedaría algo así:

```jsx
const funcionParaNoRepetirIf = (key, value) => {
    const params = new URLSearchParams();
    if (value)
        params.set(key, value);

    return params;
}

const params = funcionParaNoRepetirIf('text', debouncedTextToFilter);
if (filters.technology) params.set('technology', filters.technology);
if (filters.location) params.set('type', filters.location);
if (filters.experienceLevel) params.set('level', filters.experienceLevel);
```

Ahora si queremos agregar más parámetros al objeto `params`, tenemos que extraer la propiedad `params` y usar el método `set`. En resumen, volveríamos casi al código original.

Así que podemos hacer esto:

```jsx
const createAndSetParamIfExist = () => {
    const params = new URLSearchParams(window.location.search);
    
    const setParam = (key, value) => {
        if (value) params.set(key, value);
    };

    return {
        params,
        setParam
    }
}; 

const { params, setParam } = createAndSetParamIfExist();

setParam('text', debouncedTextToFilter);
setParam('technology', filters.technology);
setParam('type', filters.location);
setParam('level', filters.experienceLevel);
```

Exportamos de la función `createAndSetParamIfExist` el objeto `params` y la función `setParam`.
`params` para construir la URL de la API.
`setParam` para agregar parámetros a `params` en caso de que el valor que pasemos exista.

Por último, `createAndSetParamIfExist` no tiene porqué estar dentro del `useEffect` (ocupa espacio dentro del componente y hace que veamos mucha lógica dentro, lo que por `declaratividad` no queremos), así que lo mandamos para fuera y lo usamos así:

```jsx
const { params, setParam } = createAndSetParamIfExist();

setParam('text', debouncedTextToFilter);
setParam('technology', filters.technology);
setParam('type', filters.location);
setParam('level', filters.experienceLevel);
```

De esta manera nos evitamos tantos `if` en el código, lo que puede llegar a ser difícil de leer si agregamos más parámetros.

PD: Tu solución estaba genial :) Esto fue solo un pasito más allá para que veas otra forma de hacerlo, evitando `if` debajo de otros, y que sea más fácil de leer.

3. Es recomendable tener un `id` y un `name` por control pero cuando tenemos que controlarlos. Si ves el código anterior, esos `id` y `names` no los estabas usando en ningún lado de tu código para hacer cosas. Si no se usa un `id` para algo específico, no es necesario tenerlo. Lo mismo con el `name`.