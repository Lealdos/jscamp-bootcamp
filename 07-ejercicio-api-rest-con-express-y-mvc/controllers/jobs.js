/* Aquí debe ir la lógica de tu controlador */
import { DEFAULTS } from '../config.js';
import { JobsModel } from '../models/jobs.js';
export class JobsController {
    static async getAll(req, res) {
        const {
            text,
            title,
            level,
            limit = DEFAULTS.LIMIT_PAGINATION,
            technology,
            offset = DEFAULTS.LIMIT_OFFSET,
        } = req.query;

        const { data, total } = await JobsModel.getAll({
            text,
            title,
            level,
            limit,
            technology,
            offset,
        });

        const limitNumber = Number(limit);
        const offsetNumber = Number(offset);

        return res.json({
            data,
            total,
            limit: limitNumber,
            offset: offsetNumber,
        });
    }

    static getJobById(req, res) {
        const { id } = req.params;
        const job = JobsModel.getJobById(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        return res.json(job);
    }

    static createJob(req, res) {
        const jobData = req.body;
        const newJob = JobsModel.createJob(jobData);
        return res.status(201).json(newJob);
    }

    static updateJobById(req, res) {
        const { id } = req.params;
        const jobData = req.body;
        const updatedJob = JobsModel.updateJobById(id, jobData);
        if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        return res.json(updatedJob);
    }

    static partialUpdateJobById(req, res) {
        const { id } = req.params;
        const jobData = req.body;
        const updatedJob = JobsModel.partialUpdateJobById(id, jobData);
        if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        return res.json(updatedJob);
    }

    static deleteJobById(req, res) {
        const { id } = req.params;
        const deletedJob = JobsModel.deleteJobById(id);
        if (!deletedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        return res.json(deletedJob);
    }
}
