import cors from 'cors';
import { CORS_ALLOWED_ORIGINS } from '../config.js';

/* Aquí debe ir la lógica de tu middleware */

export function corsMiddleware({
    ACCEPTED_ORIGINS = CORS_ALLOWED_ORIGINS,
} = {}) {
    return cors({
        origin: (origin, callback) => {
            if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    });
}
