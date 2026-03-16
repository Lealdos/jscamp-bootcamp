// Middleware para validar jobs usando los schemas de Zod

import {
    validateJobSchema,
    validatePartialJobSchema,
} from '../schemas/jobs.js';

export function validateCreateJob(req, res, next) {
    const { success, data, error } = validateJobSchema(req.body);
    if (!success) {
        return res
            .status(400)
            .json({ error: 'Invalid Request', details: error });
    }
    req.validatedJob = data;
    next();
}

export function validateUpdatePartialJob(req, res, next) {
    const { success, data, error } = validatePartialJobSchema(req.body);
    if (!success) {
        return res
            .status(400)
            .json({ error: 'Invalid Request', details: error });
    }
    req.validatedJob = data;
    next();
}
