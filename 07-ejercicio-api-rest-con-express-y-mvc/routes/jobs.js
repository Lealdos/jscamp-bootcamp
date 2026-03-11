import { Router } from 'express';
import { JobsController } from '../controllers/jobs.js';

const jobsRouter = Router();

jobsRouter.get('/', JobsController.getAll);
jobsRouter.get('/:id', JobsController.getJobById);
jobsRouter.post('/', JobsController.createJob);
jobsRouter.put('/:id', JobsController.updateJobById);
jobsRouter.patch('/:id', JobsController.partialUpdateJobById);
jobsRouter.delete('/:id', JobsController.deleteJobById);

export { jobsRouter };
