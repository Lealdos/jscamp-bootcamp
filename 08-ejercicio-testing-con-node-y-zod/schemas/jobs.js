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

/*
    * Ejemplo de estructura de un job: 
{
    "id": "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4",
    "titulo": "Desarrollador de Software Senior",
    "empresa": "Tech Solutions Inc.",
    "ubicacion": "Remoto",
    "descripcion": "Buscamos un ingeniero de software con experiencia en desarrollo web y conocimientos en JavaScript, React y Node.js. El candidato ideal debe ser capaz de trabajar en equipo y tener buenas habilidades de comunicación.",
    "data": {
      "technology": ["react", "node", "javascript"],
      "modalidad": "remoto",
      "nivel": "senior"
    },
    "content": {
      "description": "Tech Solutions Inc. está buscando un Ingeniero de Software Senior altamente motivado y experimentado para unirse a nuestro equipo remoto. El candidato ideal tendrá una sólida formación en desarrollo de software, con experiencia en el diseño, desarrollo e implementación de soluciones de software escalables y de alto rendimiento. Como Ingeniero de Software Senior, usted será responsable de liderar proyectos de desarrollo, mentorizar a ingenieros junior y colaborar con equipos multifuncionales para entregar productos de software de alta calidad.",
      "responsibilities": "- Diseñar, desarrollar y mantener aplicaciones web utilizando tecnologías modernas.\n- Colaborar con equipos de producto y diseño para definir y entregar nuevas características.\n- Escribir código limpio, eficiente y bien documentado.\n- Realizar revisiones de código y proporcionar retroalimentación constructiva a los miembros del equipo.\n- Mentorizar ingenieros junior y guiar su desarrollo profesional.\n- Participar en reuniones de planificación y retrospectivas del equipo.\n- Mantenerse actualizado con las últimas tendencias y mejores prácticas en desarrollo de software.",
      "requirements": "- Licenciatura en Informática o campo relacionado.\n- Mínimo de 5 años de experiencia en desarrollo de software.\n- Experiencia con frameworks de JavaScript (por ejemplo, React, Angular, Vue.js).\n- Familiaridad con metodologías ágiles y herramientas de control de versiones (por ejemplo, Git).\n- Excelentes habilidades de comunicación y capacidad para trabajar en equipo.\n- Capacidad demostrada para resolver problemas complejos y pensar de manera crítica.",
      "about": "Tech Solutions Inc. es una empresa de tecnología innovadora que se centra en la creación de soluciones de software de vanguardia para diversas industrias. Estamos comprometidos con el fomento de un entorno de trabajo colaborativo e inclusivo donde cada empleado pueda prosperar y crecer profesionalmente. Ofrecemos salarios competitivos, beneficios integrales y oportunidades de desarrollo profesional continuo."
    }
  },

*/

import * as z from 'zod';

const jobSchema = z.object({
    title: z
        .string()
        .min(1, 'El título es requerido')
        .max(100, 'El título no puede tener más de 100 caracteres'),
    empresa: z.string().min(1, 'La empresa es requerida'),
    ubicacion: z.string().min(1, 'La ubicación es requerida'),
    salary: z
        .number()
        .positive('El salario debe ser un número positivo')
        .optional(),
    description: z.string().optional(),
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

function validateJobSchema(job) {
    return jobSchema.safeParse(job);
}

function validatePartialJobSchema(partialJob) {
    return jobSchema.partial().safeParse(partialJob);
}

export { validateJobSchema, validatePartialJobSchema };
