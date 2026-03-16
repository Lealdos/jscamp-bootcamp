/*
 * Aquí debes escribir tus tests para la API de jobs
 *
 * Recuerda:
 * - Usar node:test y node:assert (sin dependencias externas)
 * - Levantar el servidor con before() y cerrarlo con after()
 * - Testear todos los endpoints: GET, POST, PUT, PATCH, DELETE
 * - Verificar validaciones con Zod
 * - Comprobar códigos de estado HTTP correctos
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import app from './app.js';
import { de } from 'zod/v4/locales';

let server;

const PORT = 5678;
const baseURL = `http://localhost:${PORT}`;

before(async () => {
    return new Promise((resolve, reject) => {
        server = app.listen(PORT, () => resolve());
        server.on('error', (err) => reject(err));
    });
});

after(() => {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});

describe('Get api /jobs', () => {
    it('debe responder con 200 y un array de trabajos', async () => {
        const res = await fetch(`${baseURL}/jobs`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(
            res.headers.get('content-type')?.includes('application/json'),
            true,
        );

        const data = await res.json();
        const { data: jobs } = data;
        assert.strictEqual(Array.isArray(jobs), true);
    });
});

const technologies = ['react', 'node', 'angular', 'python', 'java', 'go'];

technologies.forEach((tech) => {
    describe(`Get api /jobs??technology=${tech}`, () => {
        it(`debe responder con 200 y trabajos que incluyan ${tech} en su data.technology`, async () => {
            const res = await fetch(`${baseURL}/jobs?technology=${tech}`);

            assert.strictEqual(res.status, 200);
            assert.strictEqual(
                res.headers.get('content-type')?.includes('application/json'),
                true,
            );

            const data = await res.json();
            const { data: jobs } = data;
            assert.strictEqual(Array.isArray(jobs), true);

            jobs.forEach((job) => {
                assert.strictEqual(job.data.technology.includes(tech), true);
            });
        });
    });
});

describe('Get api /jobs?limit=2', () => {
    it('debe responder con 200 y un array de 2 trabajos', async () => {
        const res = await fetch(`${baseURL}/jobs?limit=2`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(
            res.headers.get('content-type')?.includes('application/json'),
            true,
        );

        const data = await res.json();
        const { data: jobs, limit } = data;
        assert.strictEqual(Array.isArray(jobs), true);
        assert.strictEqual(limit, 2);
        assert.strictEqual(jobs.length, 2);
    });
});

describe('Get api /jobs?offset=1', () => {
    it('debe responder con 200 y un array de trabajos comenzando desde el segundo job', async () => {
        const res = await fetch(`${baseURL}/jobs?offset=1`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(
            res.headers.get('content-type')?.includes('application/json'),
            true,
        );

        const data = await res.json();
        const { data: jobs } = data;
        assert.strictEqual(Array.isArray(jobs), true);
        assert.strictEqual(jobs[0].id, 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57');
    });
});

// ### Tests para POST /jobs

describe('Post a job api /jobs', () => {
    it('debe responder con 201 y el job creado', async () => {
        const jobData = {
            technology: ['node', 'express'],
            modalidad: 'remoto',
            nivel: 'senior',
        };
        const newJob = {
            titulo: 'Backend Developer',
            empresa: 'Tech Company',
            ubicacion: 'Remote',
            descripcion:
                'Buscamos un Backend Developer con experiencia en Node.js y Express para unirse a nuestro equipo remoto.',
            data: jobData,
            content: {
                description:
                    'Data Driven Co. está en busca de un Analista de Datos para unirse a nuestro equipo en Ciudad de México. Esta posición es ideal para profesionales que están comenzando su carrera en análisis de datos y desean trabajar con grandes volúmenes de información para generar insights valiosos que impulsen decisiones de negocio.',
                responsibilities:
                    '- Recolectar, procesar y analizar grandes conjuntos de datos para identificar patrones y tendencias.\n- Crear visualizaciones e informes utilizando herramientas como Tableau o Power BI.\n- Colaborar con diferentes departamentos para entender sus necesidades de datos.\n- Escribir consultas SQL eficientes para extraer y transformar datos.\n- Desarrollar scripts en Python o R para automatizar análisis recurrentes.\n- Presentar hallazgos y recomendaciones a stakeholders no técnicos.',
                requirements:
                    '- Título universitario en Estadística, Matemáticas, Ciencias de la Computación o campo relacionado.\n- Conocimiento sólido en SQL para consultas de bases de datos.\n- Experiencia con Python (Pandas, NumPy) o R para análisis de datos.\n- Familiaridad con herramientas de visualización de datos.\n- Capacidad analítica y atención al detalle.\n- Buenas habilidades de comunicación para explicar resultados técnicos.',
                about: 'Data Driven Co. es una empresa líder en soluciones de análisis de datos que ayuda a organizaciones a tomar decisiones basadas en información. .',
            },
        };

        const res = await fetch(`${baseURL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newJob),
        });

        assert.strictEqual(res.status, 201);
        assert.strictEqual(
            res.headers.get('content-type')?.includes('application/json'),
            true,
        );
        const job = await res.json();
        assert.strictEqual(job.titulo, newJob.titulo);
        assert.strictEqual(job.empresa, newJob.empresa);
        assert.strictEqual(job.ubicacion, newJob.ubicacion);
        assert.strictEqual(job.descripcion, newJob.descripcion);
        assert.deepEqual(job.data, newJob.data);
        assert.deepEqual(job.content, newJob.content);
    });

    it('debe responder con 400 si falta un campo requerido', async () => {
        const incompleteJob = {
            empresa: 'Tech Company',
            ubicacion: 'Remote',
        };

        const res = await fetch(`${baseURL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(incompleteJob),
        });

        assert.strictEqual(res.status, 400);
    });
});

// ### Tests para GET /jobs/:id

describe('Get api /jobs/:id', () => {
    it('debe responder con 200 y el job correspondiente al id', async () => {
        const jobId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57';
        const res = await fetch(`${baseURL}/jobs/${jobId}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(
            res.headers.get('content-type')?.includes('application/json'),
            true,
        );

        const job = await res.json();
        assert.strictEqual(job.id, jobId);
    });

    it('debe responder con 404 si el job no existe', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';
        const res = await fetch(`${baseURL}/jobs/${nonExistentId}`);

        assert.strictEqual(res.status, 404);
    });
});

// ### Tests para PUT /jobs/:id

describe('Put api /jobs/:id', () => {
    it('debe responder con 400 si falta un campo requerido', async () => {
        const jobId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57';
        const incompleteJob = {
            empresa: 'Tech Company Updated',
            ubicacion: 'Remote Updated',
        };

        const res = await fetch(`${baseURL}/jobs/${jobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(incompleteJob),
        });

        assert.strictEqual(res.status, 400);
    });

    it('debe responder con 404 si el job no existe', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';
        const updatedJob = {
            titulo: 'Backend Developer Updated',
            empresa: 'Tech Company Updated',
            ubicacion: 'Remote Updated',
            descripcion: 'Updated description',
            data: {
                technology: ['node', 'express', 'mongodb'],
                modalidad: 'remoto',
                nivel: 'senior',
            },
            content: {
                description: 'Updated content description',
                responsibilities: 'Updated responsibilities',
                requirements: 'Updated requirements',
                about: 'Updated about',
            },
        };

        const res = await fetch(`${baseURL}/jobs/${nonExistentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedJob),
        });

        assert.strictEqual(res.status, 404);
    });

    it('debe responder con 200 y el job actualizado', async () => {
        const jobId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57';
        const updatedJob = {
            titulo: 'Backend Developer Updated',
            empresa: 'Tech Company Updated',
            ubicacion: 'Remote Updated',
            descripcion: 'Updated description',
            data: {
                technology: ['node', 'express', 'mongodb'],
                modalidad: 'remoto',
                nivel: 'senior',
            },
            content: {
                description: 'Updated content description',
                responsibilities: 'Updated responsibilities',
                requirements: 'Updated requirements',
                about: 'Updated about',
            },
        };

        const res = await fetch(`${baseURL}/jobs/${jobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedJob),
        });
        assert.strictEqual(res.status, 204);

        const updatedJobRes = await fetch(`${res.url}`);
        const job = await updatedJobRes.json();

        assert.strictEqual(job.id, jobId);
        assert.strictEqual(job.titulo, updatedJob.titulo);
        assert.strictEqual(job.empresa, updatedJob.empresa);
        assert.strictEqual(job.ubicacion, updatedJob.ubicacion);
        assert.strictEqual(job.descripcion, updatedJob.descripcion);
        assert.deepStrictEqual(job.data, updatedJob.data);
        assert.deepStrictEqual(job.content, updatedJob.content);
    });
});

// ### Tests para PATCH /jobs/:id

describe('Patch api /jobs/:id', () => {
    it('debe responder con 204 y actualizar solo los campos enviados', async () => {
        const jobId = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405';
        const originalJobRes = await fetch(`${baseURL}/jobs/${jobId}`);
        const originalJob = await originalJobRes.json();

        const partialUpdate = {
            titulo: 'Frontend Developer Updated',
            ubicacion: 'Remote Updated',
        };

        const res = await fetch(`${baseURL}/jobs/${jobId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialUpdate),
        });

        assert.strictEqual(res.status, 204);

        const updatedJobRes = await fetch(`${baseURL}/jobs/${jobId}`);
        const job = await updatedJobRes.json();

        assert.strictEqual(job.id, jobId);
        assert.strictEqual(job.titulo, partialUpdate.titulo);
        assert.strictEqual(job.ubicacion, partialUpdate.ubicacion);
        assert.strictEqual(job.empresa, originalJob.empresa);
        assert.strictEqual(job.descripcion, originalJob.descripcion);
        assert.deepStrictEqual(job.data, originalJob.data);
        assert.deepStrictEqual(job.content, originalJob.content);
    });

    it('debe responder con 404 si el job no existe', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';
        const partialUpdate = {
            titulo: 'Frontend Developer Updated',
        };

        const res = await fetch(`${baseURL}/jobs/${nonExistentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialUpdate),
        });

        assert.strictEqual(res.status, 404);
    });
});

// ### Tests para DELETE /jobs/:id
/*
 Escribe tests para verificar la eliminación de un job.

#### Tests requeridos

1. **Debe recibir 204 y eliminar el trabajo**
   - Usar un ID válido (ej: `f62d8a34-923a-4ac2-9b0b-14e0ac2f5405`)
   - Verificar status code 204
   - Hacer un GET del mismo job y verificar que devuelve 404

2. **Debe devolver 404 cuando el ID no existe**
   - Usar un ID inválido
   - Verificar status code 404
   */

describe('Delete api /jobs/:id', () => {
    it('debe responder con 204 y eliminar el trabajo', async () => {
        const jobId = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405';

        const res = await fetch(`${baseURL}/jobs/${jobId}`, {
            method: 'DELETE',
        });
        assert.strictEqual(res.status, 204);

        const getRes = await fetch(`${baseURL}/jobs/${jobId}`);
        assert.strictEqual(getRes.status, 404);
    });

    it('debe devolver 404 cuando el ID no existe', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';

        const res = await fetch(`${baseURL}/jobs/${nonExistentId}`, {
            method: 'DELETE',
        });
        assert.strictEqual(res.status, 404);
    });
});
