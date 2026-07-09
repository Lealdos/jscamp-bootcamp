<!-- Aquí puedes poner tus dudas del ejercicio -->

- En el video de testing midu usa import test de 'node:test' pero buscando y preguntandole a la IA vi que aparentemente 'it' es una practica mas comun hoy en dia ya que siga la convencion de librerias populares de test como lo son jest o motcha es buena idea que lo mantenga asi o es mejor volver a test?

**Respuesta:**
Hola! Muy buena pregunta, ambas hacen lo mismo :) Así que usa la que más cómodo te haga sentir. Tanto jest como mocha tienen las dos variantes disponibles (`test` e `it`).

Usar una no quita que puedas usar la otra, en los mismos test puede existir `it` y `test`. No lo digo para que uses ambas, sino para que te quedes tranquilo de que no va a haber ninguna diferencia más que subjetiva de cuál usar.

Por otro lado, jest y mocha son muy conocidas y usadas, si ves proyectos viejos seguramente usen jest, pero hoy en día hay alternativas mejores y más rápidas como vitest (librería que luego vamos a ver). Esta también acepta sus dos variantes.

Por suerte, entre librerías de test la sintaxis no cambia mucho, así que si alguna vez te encuentras con una, no te costará nada entender la otra.

- No seria mejor separar los test en distintos ficheros segun el end point? pues el fichero app.test.js es sumamente largo y dificil de seguir

**Respuesta:**
Si! Es una muy buena idea. Al ser un proyecto pequeño no lo dejamos como tarea, pero es verdad que aún así, con todos los test hechos, se hace difícil de seguir.

Separar por endpoint es una idea genial :)

- Hay alguna manera de hacer el codigo de los test menos repetitivo?

**Respuesta:**
Se puede! Todo lo que sea repetido se puede modularizar en funciones helper o fixtures.
En estos casos de test, lo que se me puede ocurrir es:

- Crear una función `handleGetRequestByPathAndCheckFormat` que reciba el path y haga el fetch y las aserciones.

```js
const handleGetRequestByPathAndCheckFormat = async (path = '/') => {
    const res = await fetch(`${baseURL}${path}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(
        res.headers.get('content-type')?.includes('application/json'),
        true,
    );

    const data = await res.json();
    return data;
};
```

Entonces, en vez de hacerlo siempre en cada test, podrías hacer:

```js
describe('Get api /jobs', () => {
    it('debe responder con 200 y un array de trabajos', async () => {
        const { data: jobs } =
            await handleGetRequestByPathAndCheckFormat('/jobs');
        assert.strictEqual(Array.isArray(jobs), true);
    });
});

technologies.forEach((tech) => {
    describe(`Get api /jobs?technology=${tech}`, () => {
        it(`debe responder con 200 y trabajos que incluyan ${tech} en su data.technology`, async () => {
            const { data: jobs } = await handleGetRequestByPathAndCheckFormat(
                `/jobs?technology=${tech}`,
            );

            assert.strictEqual(Array.isArray(jobs), true);

            jobs.forEach((job) => {
                assert.strictEqual(job.data.technology.includes(tech), true);
            });
        });
    });
});
```

Así con otras partes repetitivas.
Lo importante y lo que sí tiene que pasar en cada test, es que sea súper declarativo. Al leer los helpers se tiene que entender qué están haciendo.

De hecho, este último ejemplo lo vamos a aplicar en la corrección para que veas cómo se puede hacer.

PD: Faltó verificar alguno tests:

- título < 3 → Status: 400
- título > 100 → Status: 400
- título no string → Status: 400

Por favor verificar si los test agregados son correctos en por la posdata que me dijiste gracias.

Agradezco la explicacion tomare nota e intentare pensar mejor las como modularizar de mejor manera el codigo cuando vea claramente algo muy repetido.
