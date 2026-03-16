import { Router } from 'express';
import { JobController } from '../controllers/jobs.js';
import {
    validateJobSchema,
    validatePartialJobSchema,
} from '../schemas/jobs.js';

export const jobsRouter = Router();

jobsRouter.get('/', JobController.getAll);
jobsRouter.get('/:id', JobController.getId);

jobsRouter.post('/', validateJobSchema, JobController.create);

jobsRouter.put('/:id', validateJobSchema, JobController.update);

jobsRouter.patch('/:id', validatePartialJobSchema, JobController.partialUpdate);

jobsRouter.delete('/:id', JobController.delete);
