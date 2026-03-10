/* IMPORTANTE: Todas las funciones que hagamos deben empezar en minúscula. No da error pero es una buena práctica, por convención y para separarlas de las clases (que si empiezan con mayúscula) */

import { createServer } from 'node:http';
import { json } from 'node:stream/consumers';
import { randomUUID } from 'node:crypto';

if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile();
    } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
    }
}

const port = process.env.PORT || 3000;

const users = [
    {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        name: 'Miguel',
        age: 28,
    },
    {
        id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b',
        name: 'Mateo',
        age: 34,
    },
    {
        id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
        name: 'Pablo',
        age: 22,
    },
    {
        id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
        name: 'Lucía',
        age: 31,
    },
    {
        id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e',
        name: 'Ana',
        age: 26,
    },
    {
        id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a',
        name: 'Juan',
        age: 29,
    },
    {
        id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d',
        name: 'Sofía',
        age: 25,
    },
    {
        id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
        name: 'Carlos',
        age: 37,
    },
    {
        id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f',
        name: 'Elena',
        age: 23,
    },
    {
        id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b',
        name: 'Diego',
        age: 30,
    },
];

const server = createServer(async (req, res) => {
    const { searchParams } = new URL(
        req.url,
        `http://${req.headers.host}`,
    );

    /* 
    Debajo dejé algunas alternativas a `routeHandler` y cómo entendía la fina linea entre: vale la pena separar la responsabilidad o no. Aquí opto por quitar el if y manejar el 404 directamente en caso de que no entre a ninguna de las rutas que tenemos en los `if` siguientes.
    */
    /* if (!routeHandler(pathname)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    } */
    if (pathname === '/users') {
        await handlerUsersRequest(res, searchParams, req);
    }
    if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    }

    /* Para ahorrarnos un `if`, si no entra a ningún caso anterior, entonces es 404 */
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
});

/* Siempre dejemos el verbo en el nombre de la función para saber que hace. Obtiene, modifica o elimina? Por eso agregué el `get`. Si queremos ir un poco más al detalle (no es necesario pero te lo dejo igual, es llamarlo `getFilterUsersBySearchParams). Damos información al leer la función de que estamos obteniendo los usuarios filtrados por los parámetros de búsqueda. Cuando el proyecto se hace grande me gusta definirlo así */
function getFilterUsers(searchParams) {
    const searchParamsAllowed = ['minAge', 'maxAge', 'name', 'limit', 'offset'];
    if (
        [...searchParams.keys()].some(
            (param) => !searchParamsAllowed.includes(param),
        )
    ) {
        return {
            result: [],
            message: `Invalid query parameters. Allowed parameters are: ${searchParamsAllowed.join(
                ', ',
            )}`,
        };
    }

    const numberParams = ['minAge', 'maxAge', 'limit', 'offset'];
    const SearchParamsAreNumber = numberParams.some(
        (param) =>
            !!(
                Number.isNaN(Number(searchParams.get(param))) ||
                searchParams.get(param) === null
            ),
    );

    if (!SearchParamsAreNumber) {
        return { result: [], message: 'Invalid query parameter' };
    }

    const minAge = Number(searchParams.get('minAge'));
    const maxAge = Number(searchParams.get('maxAge'));
    const name = searchParams.get('name');
    const limit = Number(searchParams.get('limit')) || users.length;
    const offset = Number(searchParams.get('offset')) || 0;
    let filteredUsers = users;

    if (minAge) {
        filteredUsers = filteredUsers.filter((user) => user.age >= minAge);
    }
    if (maxAge) {
        filteredUsers = filteredUsers.filter((user) => user.age <= maxAge);
    }
    if (name) {
        filteredUsers = filteredUsers.filter((user) =>
            user.name.toLowerCase().includes(name.toLowerCase()),
        );
    }
    if (limit) {
        filteredUsers = filteredUsers.slice(0, limit);
    }
    if (offset) {
        filteredUsers = filteredUsers.slice(offset);
    }
    return { result: filteredUsers, message: null };
}

/* Esto está Excelente!! */
async function handlerUsersRequest(res, searchParams, req) {
    if (req.method === 'GET') {
        /* Antes estabamos ejecutando la función dos veces. Ahora lo hacemos una vez, y a partir del resultado de `result` y `message` tomamos decisiones */
        const { result, message } = getFilterUsers(searchParams);

        if (message) {
            sendJson(res, 400, { message });
            return;
        }

        sendJson(res, 200, result);
    }

    if (req.method === 'POST') {
        const body = await json(req);
        const newUser = {
            id: randomUUID(),
            ...body,
        };
        users.push(newUser);
        sendJson(res, 201, newUser);
    }
}

/* Estamos repitiendo mucho la cabecera de `json`. Podemos crear una función para hacer esto: */
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

/* Está muy bien y soy partidario de separar responsabilidades por funciones. Pero siempre y cuando hacer esto haga que el código sea más legible y entendible. En este caso me pasó lo siguiente:
No sabía que hacía routerHandler y cómo funcionaba, tuve que ir a buscar la función para entender que estaba manejando las rutas /users y /health.

Acá veo dos caminos:
1. Cambiar el nombre de la función y pasarle las rutas aceptadas como parámetro
2. No usar la función
*/

/*
Ejemplo 1:
Con el nombre de la función sabemos:

- Qué hace (isInvalidPath) - El path que pasamos es inválido con respecto a la lista que le pasamos?
- Qué recibe (path, allowedPaths)
- Qué retorna (boolean) [Siempre que una función empieza con un `is` o con un `has`, entendemos que retorna un boolean]

/* function isInvalidPath(path, allowedPaths) {
    return !allowedPaths.includes(path);
} */


function routeHandler(url) {
    const routesAccepted = ['/users', '/health'];
    return routesAccepted.includes(url);
}
server.listen(port, () => {
    const address = server.address();
    console.log(`Servidor escuchando en http://localhost:${address.port}`);
});
