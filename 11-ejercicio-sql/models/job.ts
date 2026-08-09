import crypto from 'node:crypto';
import { db } from '../db/database';
import type {
    Job,
    JobData,
    CreateJobDTO,
    UpdateJobDTO,
    JobFilters,
} from '../types';

const BASE_SELECT = `
  SELECT
    j.id,
    j.title,
    j.company,
    j.location,
    j.description,
    j.modality,
    j.level,
    COALESCE((
      SELECT json_group_array(technology)
      FROM (
        SELECT technology
        FROM job_technologies
        WHERE job_id = j.id
        ORDER BY rowid
      )
    ), '[]') AS technologies,
    c.description      AS content_description,
    c.responsibilities AS content_responsibilities,
    c.requirements     AS content_requirements,
    c.about            AS content_about
  FROM jobs j
  LEFT JOIN job_content c ON c.job_id = j.id
`;

interface JobRow {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    modality: JobData['modality'];
    level: JobData['level'];
    technologies: string;
    content_description: string | null;
    content_responsibilities: string | null;
    content_requirements: string | null;
    content_about: string | null;
}

function rowToJob(row: JobRow): Job {
    const job: Job = {
        id: row.id,
        title: row.title,
        company: row.company,
        location: row.location,
        description: row.description,
        data: {
            technology: JSON.parse(row.technologies) as string[],
            modality: row.modality,
            level: row.level,
        },
    };

    // Sin fila en job_content el LEFT JOIN deja los alias en NULL: el job no
    // tiene content y la clave no debe aparecer.
    if (row.content_description !== null) {
        job.content = {
            description: row.content_description,
            responsibilities: row.content_responsibilities ?? '',
            requirements: row.content_requirements ?? '',
            about: row.content_about ?? '',
        };
    }

    return job;
}

export class JobModel {
    // Obtener todos los jobs con filtros opcionales
    static async getAll(filters?: JobFilters): Promise<Job[]> {
        const conditions: string[] = [];
        const params: unknown[] = [];

        if (filters?.modality) {
            conditions.push('j.modality = ?');
            params.push(filters.modality);
        }

        if (filters?.level) {
            conditions.push('j.level = ?');
            params.push(filters.level);
        }

        // EXISTS sobre la tabla hija: filtra sin recortar el array de tecnologías.
        if (filters?.tech) {
            conditions.push(`EXISTS (
        SELECT 1 FROM job_technologies t
        WHERE t.job_id = j.id AND LOWER(t.technology) = LOWER(?)
      )`);
            params.push(filters.tech);
        }

        const where =
            conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const rows = db
            .prepare(`${BASE_SELECT} ${where} ORDER BY j.rowid`)
            .all(...params) as JobRow[];

        return rows.map(rowToJob);
    }

    // Obtener un job por ID
    static async getById(id: string): Promise<Job | undefined> {
        const row = db.prepare(`${BASE_SELECT} WHERE j.id = ?`).get(id) as
            | JobRow
            | undefined;

        return row ? rowToJob(row) : undefined;
    }

    // Crear un nuevo job
    static async create(input: CreateJobDTO): Promise<Job> {
        const newJob: Job = {
            id: crypto.randomUUID(),
            ...input,
        };

        const insertJob = db.prepare(`
      INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (@id, @title, @company, @location, @description, @modality, @level)
    `);
        const insertTechnology = db.prepare(
            'INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)',
        );
        const insertContent = db.prepare(`
      INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const runCreate = db.transaction((job: Job) => {
            insertJob.run({
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                modality: job.data.modality,
                level: job.data.level,
            });

            for (const technology of job.data.technology) {
                insertTechnology.run(job.id, technology);
            }

            if (job.content) {
                insertContent.run(
                    crypto.randomUUID(),
                    job.id,
                    job.content.description,
                    job.content.responsibilities,
                    job.content.requirements,
                    job.content.about,
                );
            }
        });

        runCreate(newJob);

        return newJob;
    }

    // Eliminar un job
    static async delete(id: string): Promise<boolean> {
        const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id);

        // changes cuenta solo las filas de jobs; las hijas caen por CASCADE.
        return result.changes > 0;
    }

    // Actualizar un job
    static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
        const exists = db.prepare('SELECT 1 FROM jobs WHERE id = ?').get(id);
        if (!exists) return null;

        const fields: string[] = [];
        const params: unknown[] = [];

        // Lista blanca de columnas: ninguna clave del body llega al SQL.
        if (input.title !== undefined) {
            fields.push('title = ?');
            params.push(input.title);
        }
        if (input.company !== undefined) {
            fields.push('company = ?');
            params.push(input.company);
        }
        if (input.location !== undefined) {
            fields.push('location = ?');
            params.push(input.location);
        }
        if (input.description !== undefined) {
            fields.push('description = ?');
            params.push(input.description);
        }
        if (input.data?.modality !== undefined) {
            fields.push('modality = ?');
            params.push(input.data.modality);
        }
        if (input.data?.level !== undefined) {
            fields.push('level = ?');
            params.push(input.data.level);
        }

        const runUpdate = db.transaction(() => {
            // Un PATCH {} es válido, y `UPDATE jobs SET WHERE id = ?` sería un error
            // de sintaxis.
            if (fields.length > 0) {
                db.prepare(
                    `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`,
                ).run(...params, id);
            }

            if (input.data?.technology !== undefined) {
                db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(
                    id,
                );
                const insertTechnology = db.prepare(
                    'INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)',
                );
                for (const technology of input.data.technology) {
                    insertTechnology.run(id, technology);
                }
            }

            if (input.content !== undefined) {
                db.prepare('DELETE FROM job_content WHERE job_id = ?').run(id);
                db.prepare(
                    `INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
           VALUES (?, ?, ?, ?, ?, ?)`,
                ).run(
                    crypto.randomUUID(),
                    id,
                    input.content.description,
                    input.content.responsibilities,
                    input.content.requirements,
                    input.content.about,
                );
            }
        });

        runUpdate();

        return (await JobModel.getById(id)) ?? null;
    }
}
