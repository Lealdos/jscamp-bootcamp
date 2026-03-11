import jobs from '../jobs.json' with { type: 'json' };

console.log(jobs.length);

/* Aquí deberá ir la lógica de tu modelo */
/* Recuerda que el modelo SOLO debe manejar la lógica de los datos, en este caso nuestro JSON */

export class JobsModel {
    static async getAll({
        text,
        title,
        level,
        limit = 10,
        technology,
        offset = 0,
    }) {
        let filteredJobs = jobs;

        if (text) {
            const searchTerm = text.toLowerCase();
            filteredJobs = filteredJobs.filter(
                (job) =>
                    job.titulo.toLowerCase().includes(searchTerm) ||
                    job.descripcion.toLowerCase().includes(searchTerm),
            );
        }

        if (technology) {
            filteredJobs = filteredJobs.filter((job) =>
                job.data.technology.includes(technology),
            );
        }
        if (title) {
            filteredJobs = filteredJobs.filter((job) =>
                job.titulo.toLowerCase().includes(title.toLowerCase()),
            );
        }
        if (level) {
            filteredJobs = filteredJobs.filter((job) =>
                job.data.level.toLowerCase().includes(level.toLowerCase()),
            );
        }

        const limitNumber = Number(limit);
        const offsetNumber = Number(offset);

        const paginatedJobs = filteredJobs.slice(
            offsetNumber,
            offsetNumber + limitNumber,
        );

        return { data: paginatedJobs, total: filteredJobs.length };
    }

    static getJobById(id) {
        return jobs.find((job) => job.id === id);
    }

    static createJob(jobData) {
        const { titulo, empresa, ubicacion, descripcion, data, content } =
            jobData;
        const newJob = {
            id: crypto.randomUUID(),
            titulo,
            empresa,
            ubicacion,
            descripcion,
            data,
            content,
        };
        jobs.push(newJob);
        return newJob;
    }

    static updateJobById(id, jobData) {
        const { titulo, empresa, ubicacion, descripcion, data, content } =
            jobData;
        const index = jobs.findIndex((job) => job.id === id);
        if (index === -1) return null;
        jobs[index] = {
            id,
            titulo,
            empresa,
            ubicacion,
            descripcion,
            data,
            content,
        };
        return jobs[index];
    }

    static partialUpdateJobById(id, jobData) {
        const index = jobs.findIndex((job) => job.id === id);
        if (index === -1) return null;
        jobs[index] = Object.assign(jobs[index], jobData);
        return jobs[index];
    }

    static deleteJobById(id) {
        const index = jobs.findIndex((job) => job.id === id);
        if (index === -1) return null;
        const deletedJob = jobs.splice(index, 1);
        return deletedJob[0];
    }
}
