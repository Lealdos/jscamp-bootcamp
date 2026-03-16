/*
 * Aquí debes crear el schema de validación con Zod para los jobs
 *
 * Recuerda:
 * - Importar zod
 * - Crear un schema que valide la estructura de un job
 * - Exportar funciones validateJob() y validatePartialJob()
 * - Usar safeParse() para validar sin lanzar excepciones
 * - Definir reglas de validación (min, max, required, optional, etc.)
 */

import * as z from 'zod';

const jobSchema = z.object({
    titulo: z
        .string()
        .min(3, 'El título es requerido')
        .max(100, 'El título no puede tener más de 100 caracteres'),
    empresa: z.string().min(1, 'La empresa es requerida'),
    ubicacion: z.string().min(1, 'La ubicación es requerida'),
    descripcion: z.string().optional(),
    content: z
        .object({
            description: z.string().optional(),
            responsibilities: z.string().optional(),
            requirements: z.string().optional(),
            about: z.string().optional(),
        })
        .optional(),
    data: z
        .object({
            technology: z.array(z.string()).optional(),
            modalidad: z.string().optional(),
            nivel: z.string().optional(),
        })
        .optional(),
});

export function validateJobSchema(job) {
    return jobSchema.safeParse(job);
}

export function validatePartialJobSchema(partialJob) {
    return jobSchema.partial().safeParse(partialJob);
}
