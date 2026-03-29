/* En este ejercicio deberás tipar las funciones con los tipos ya creados. Ten en cuenta que los tipos de experiencia son literales, por lo que tendrás que corregir el código para que funcione correctamente. */

import { Candidate, Job } from './objects.ts';
import { Technology, ExperienceLevel } from './types.ts';

// Validar candidato para un empleo
export function isQualified(candidate: Candidate, job: Job): boolean {
    // Verificar años de experiencia
    const experienceLevels: Record<ExperienceLevel, number> = {
        Junior: 0,
        Mid: 2,
        Senior: 5,
        Lead: 8,
    };

    const requiredYears = experienceLevels[job.experienceLevel];

    if (candidate.experienceYears < requiredYears) {
        return false;
    }

    // Verificar si tiene al menos una tecnología requerida
    const hasRequiredSkill = job.technologies.some((tech: Technology) =>
        candidate.skills.includes(tech),
    );

    return hasRequiredSkill;
}

// Función con type guards - formatear salario
export function formatSalary(salary: number | undefined): string {
    if (salary === undefined) {
        return 'Salario no especificado';
    }

    return `€${salary.toLocaleString()}`;
}

// Validar email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
