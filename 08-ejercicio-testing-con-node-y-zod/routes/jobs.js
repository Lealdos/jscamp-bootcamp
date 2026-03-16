import { Router } from 'express';
import { JobController } from '../controllers/jobs.js';
import {
    validateCreateJob,
    validateUpdatePartialJob,
} from '../middlewares/jobs.js';

export const jobsRouter = Router();

jobsRouter.get('/', JobController.getAll);
jobsRouter.get('/:id', JobController.getId);

jobsRouter.post('/', validateCreateJob, JobController.create);

jobsRouter.put('/:id', validateCreateJob, JobController.update);

jobsRouter.patch('/:id', validateUpdatePartialJob, JobController.partialUpdate);

jobsRouter.delete('/:id', JobController.delete);
