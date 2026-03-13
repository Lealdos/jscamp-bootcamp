import { Router } from 'express';
import { JobController } from '../controllers/jobs.js';
import { validateJob, validatePartialJob } from '../schemas/jobs.js';

export const jobsRouter = Router();

jobsRouter.get('/', JobController.getAll);
jobsRouter.get('/:id', JobController.getId);

jobsRouter.post('/', validateJob, JobController.create);

jobsRouter.put('/:id', JobController.update);

jobsRouter.patch('/:id', validatePartialJob, JobController.partialUpdate);

jobsRouter.delete('/:id', JobController.delete);
