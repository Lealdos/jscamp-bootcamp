# Dudas

<!-- Escribe aquí tus dudas -->
Tengo un par de dudas que me surgieron debido a como se el como gasto tiempo de ejecucion los actions entre otras cosas, gracias por su tiempo para responderlas.

1- instalar de manera separada en cada maquina por ejemplo node/bun/pnpm o cualquiera que sea la tecnologia que se quiera instalar o usar consume tiempo de ejecucion lo que al final se puede traducir en gastos para repositorios grandes. con esto en contexto hay alguna manera digamos hacer una sola instalacion estas tecnologias y luego hacerlas todas con esa misma maquina... asi capaz se pierde hacer distintos jobs en paralelo supongo pero no se cual es la mejor opcion a la hora de ser eficiente a nivel de facturacion para una organizacion. lo digo porque en mi caso me una de las action me tomo casi 9 minutos de ejecucion lo cual me parecio bastante largo comparado con lo visto en las clases y fue justo en el paso de preparar node y pnpm

---

## Respuesta

Hola! Buena pregunta, vamos a verlo por partes:

1. Instalar una sola vez y compartir

Esto en GitHub (usando los jobs con runners) no se puede hacer:
Cada job arranca una VM diferente y aislada entre ellas, es la idea que funcione así por temas de seguridad y que cada máquina corre en un entorno limpio y conocido, sin usar recursos o datos de otra VM.

Lo que si se puede hacer es el segundo punto que te quiero mencionar:

2. Cachear las dependencias

Una cosa que podemos hacer para que el `pnpm install --froze-lockfile` se ejecute rápido (esto es lo que suele demorar mucho sobre todo en proyectos grandes) es usar la opción `cache: 'pnpm'` en la composite action:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
      node-version: ${{ inputs.node-version }}
      cache: 'pnpm'
```

Lo que hace esto es guardar en cache cierta data y verificar en el momento de correr la action que no se hayan cambiado las dependencias. Si las dependencias del proyecto son las mismas, lo que hacemos es usar el store cacheado de pnpm y no reinstalar todo.

Con respecto a la factura, las actions se cobran por tiempo, así que tener 4 tareas de 2 minutos en paralelo es lo mismo que tener 1 tarea de 8 minutos. Paralelizar sirve para tener despliegues mucho más rápidos, y para modularizar las responsabilidades. Lo que te puede ahorrar dinero es cachear las dependencias como vimos arriba.

Espero se haya entendido :) Cualquier duda nos la puedes decir!
