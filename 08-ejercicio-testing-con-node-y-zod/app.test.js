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

const handleGetRequestByPathAndCheckFormat = async (path = '/', status = 200) => {
    const res = await fetch(`${baseURL}${path}`);
    assert.strictEqual(res.status, status);
    assert.strictEqual(
      res.headers.get('content-type')?.includes('application/json'),
      true,
    );

    const data = await res.json();
    return data;
};

const handlePostRequestByPathAndCheckFormat = async (path = '/', body = {}, statusExpected = 200) => {
    const res = await fetch(`${baseURL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    assert.strictEqual(res.status, statusExpected);
    assert.strictEqual(
      res.headers.get('content-type')?.includes('application/json'),
      true,
    );

    const data = await res.json();
    return data;
};

const handlePutRequestByPathAndCheckFormat = async (path = '/', body = {}, statusExpected = 200) => {
    const res = await fetch(`${baseURL}${path}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    
    assert.strictEqual(res.status, statusExpected);
};

const handlePatchRequestByPathAndCheckFormat = async (path = '/', body = {}, statusExpected = 200) => {
    const res = await fetch(`${baseURL}${path}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    assert.strictEqual(res.status, statusExpected);
};

const handleDeleteRequestByPathAndCheckFormat = async (path = '/', statusExpected = 200) => {
    const res = await fetch(`${baseURL}${path}`, {
        method: 'DELETE',
    });
    
    assert.strictEqual(res.status, statusExpected);
    return res;
};

describe('Get api /jobs', () => {
    it('debe responder con 200 y un array de trabajos', async () => {
        const { data: jobs } = await handleGetRequestByPathAndCheckFormat('/jobs');
        assert.strictEqual(Array.isArray(jobs), true);
    });
});

const technologies = ['react', 'node', 'angular', 'python', 'java', 'go'];

// La responsabilidad del test es una sola, verificar que todos los trabajos retornados incluyan la tecnología especificada. Por lo tanto, no hay que hacer un test para cada tecnología, sino uno solo que verifique todas.

// Lo hago aquí debajo y comento tu solución:
  describe(`Get api /jobs?technology={${technologies.map((tech) => tech).join(',')}}`, () => {
        it(`debe responder con 200 y trabajos que incluyan todas las tecnologías especificadas en su data.technology`, async () => {
            const allTestsByTechnology = technologies.map((tech) => {
                return handleGetRequestByPathAndCheckFormat(`/jobs?technology=${tech}`);
            });

            const results = await Promise.all(allTestsByTechnology);

            results.forEach(({ data: jobs }, i) => {
                assert.strictEqual(Array.isArray(jobs), true);
                jobs.forEach((job) => {
                     assert.strictEqual(job.data.technology.includes(technologies[i]), true);
                });
            });
        });
    });

/* technologies.forEach((tech) => {
    describe(`Get api /jobs?technology=${tech}`, () => {
        it(`debe responder con 200 y trabajos que incluyan ${tech} en su data.technology`, async () => {
            const { data: jobs } = await handleGetRequestByPathAndCheckFormat(`/jobs?technology=${tech}`);

            assert.strictEqual(Array.isArray(jobs), true);

            jobs.forEach((job) => {
                assert.strictEqual(job.data.technology.includes(tech), true);
            });
        });
    });
}); */

describe('Get api /jobs?limit=2', () => {
    it('debe responder con 200 y un array de 2 trabajos', async () => {
        // Pasamos nuestro limit a una variable, ya que se reutiliza en varios lados
        const LIMIT = 2;
        
        const { data: jobs, limit } = await handleGetRequestByPathAndCheckFormat(`/jobs?limit=${LIMIT}`);

        assert.strictEqual(Array.isArray(jobs), true);
        assert.strictEqual(limit, LIMIT);
        assert.strictEqual(jobs.length, LIMIT);
    });
});

describe('Get api /jobs?offset=1', () => {
    it('debe responder con 200 y un array de trabajos comenzando desde el segundo job', async () => {
        const OFFSET = 1;
        const { data: jobsByOffset } = await handleGetRequestByPathAndCheckFormat(`/jobs?offset=${OFFSET}`);

        assert.strictEqual(Array.isArray(jobsByOffset), true);
        
        // En vez de agarrar el ID a mano, vamos a hacerlo dinámico (es más largo pero la idea de los tests es que se mantengan en el tiempo)
        const { data: allJobs } = await handleGetRequestByPathAndCheckFormat(`/jobs`);
        const jobToCompare = allJobs[OFFSET];

        assert.strictEqual(jobsByOffset[0].id, jobToCompare.id);
    });
});

/* describe('Get api /jobs?offset=1', () => {
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
}); */

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
                    'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                responsibilities:
                    'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                requirements:
                    'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                about: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            },
        };

        const job = await handlePostRequestByPathAndCheckFormat('/jobs', newJob, 201);

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

        await handlePostRequestByPathAndCheckFormat('/jobs', incompleteJob, 400);
    });

    const validJob = {
        empresa: 'Tech Company',
        ubicacion: 'Remote',
    };

    it('debe responder con 400 si el título tiene menos de 3 caracteres', async () => {
        const jobWithShortTitle = { ...validJob, titulo: 'ab' };

        await handlePostRequestByPathAndCheckFormat('/jobs', jobWithShortTitle, 400);
    });

    it('debe responder con 400 si el título tiene más de 100 caracteres', async () => {
        const jobWithLongTitle = { ...validJob, titulo: 'a'.repeat(101) };

        await handlePostRequestByPathAndCheckFormat('/jobs', jobWithLongTitle, 400);
    });

    it('debe responder con 400 si el título no es un string', async () => {
        const jobWithInvalidTitle = { ...validJob, titulo: 12345 };

        await handlePostRequestByPathAndCheckFormat('/jobs', jobWithInvalidTitle, 400);
    });
});

// ### Tests para GET /jobs/:id

describe('Get api /jobs/:id', () => {
    it('debe responder con 200 y el job correspondiente al id', async () => {
        const jobId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57';
        const job = await handleGetRequestByPathAndCheckFormat(`/jobs/${jobId}`);

        assert.strictEqual(job.id, jobId);
    });

    it('debe responder con 404 si el job no existe', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';
        await handleGetRequestByPathAndCheckFormat(`/jobs/${nonExistentId}`, 404);
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

        await handlePutRequestByPathAndCheckFormat(`/jobs/${jobId}`, incompleteJob, 400);
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

        await handlePutRequestByPathAndCheckFormat(`/jobs/${nonExistentId}`, updatedJob, 404);
    });

    it('debe responder con 204 y el job actualizado', async () => {
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

        await handlePutRequestByPathAndCheckFormat(`/jobs/${jobId}`, updatedJob, 204);

        const job = await handleGetRequestByPathAndCheckFormat(`/jobs/${jobId}`);

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
        const originalJob = await handleGetRequestByPathAndCheckFormat(`/jobs/${jobId}`);
        
        const partialUpdate = {
            titulo: 'Frontend Developer Updated',
            ubicacion: 'Remote Updated',
        };

        await handlePatchRequestByPathAndCheckFormat(`/jobs/${jobId}`, partialUpdate, 204);

        const job = await handleGetRequestByPathAndCheckFormat(`/jobs/${jobId}`);

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

        await handlePatchRequestByPathAndCheckFormat(`/jobs/${nonExistentId}`, partialUpdate, 404);
    });
});

// ### Tests para DELETE /jobs/:id

describe('Delete api /jobs/:id', () => {
    it('debe responder con 204 y eliminar el trabajo', async () => {
        const jobId = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405';

        await handleGetRequestByPathAndCheckFormat(`/jobs/${jobId}`);
        await handleDeleteRequestByPathAndCheckFormat(`/jobs/${jobId}`, 204);
        await handleGetRequestByPathAndCheckFormat(`/jobs/${jobId}`, 404);
    });

    it('debe devolver 404 cuando el ID no existe', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';

        await handleDeleteRequestByPathAndCheckFormat(`/jobs/${nonExistentId}`, 404);
    });
});
