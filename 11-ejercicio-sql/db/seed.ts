import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { db } from './database';

interface RawJob {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    modality: string;
    level: string;
    technologies: string[];
    content?: {
        description: string;
        responsibilities: string;
        requirements: string;
        about: string;
    };
}

const rawJobs = JSON.parse(
    readFileSync(new URL('../jobs.json', import.meta.url), 'utf-8'),
) as RawJob[];

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    company     TEXT NOT NULL,
    location    TEXT NOT NULL,
    description TEXT NOT NULL,
    modality    TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level       TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id     TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id               TEXT PRIMARY KEY,
    job_id           TEXT NOT NULL,
    description      TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements     TEXT NOT NULL,
    about            TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`);

const clearJobs = db.prepare('DELETE FROM jobs');

const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (@id, @title, @company, @location, @description, @modality, @level)
`);

const insertTechnology = db.prepare(`
  INSERT INTO job_technologies (job_id, technology)
  VALUES (@job_id, @technology)
`);

const insertContent = db.prepare(`
  INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (@id, @job_id, @description, @responsibilities, @requirements, @about)
`);

const seedJobs = db.transaction((jobs: RawJob[]) => {
    clearJobs.run();

    for (const job of jobs) {
        insertJob.run({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            modality: job.modality.trim().toLowerCase(),
            level: job.level.trim().toLowerCase(),
        });

        for (const technology of job.technologies ?? []) {
            insertTechnology.run({
                job_id: job.id,
                technology: technology.trim().toLowerCase(),
            });
        }

        if (job.content) {
            insertContent.run({
                id: crypto.randomUUID(),
                job_id: job.id,
                description: job.content.description,
                responsibilities: job.content.responsibilities,
                requirements: job.content.requirements,
                about: job.content.about,
            });
        }
    }
});

seedJobs(rawJobs);

const count = (table: string) =>
    (
        db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get() as {
            total: number;
        }
    ).total;

console.log('Seed completado:');
console.log(`  jobs:             ${count('jobs')}`);
console.log(`  job_technologies: ${count('job_technologies')}`);
console.log(`  job_content:      ${count('job_content')}`);

db.close();
