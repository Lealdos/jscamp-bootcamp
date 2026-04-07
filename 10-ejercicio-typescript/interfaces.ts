/* En este archivo deberás tipar las interfaces de los servicios de búsqueda y aplicación a empleo */

import {
    filterByExperience,
    filterByMinSalary,
    filterByTechnology,
    searchJobs,
} from './functions.ts';
import type { Job } from './objects.ts';
import { ApplicationStatus } from './types.ts';

// Interface para servicios de búsqueda
export interface JobSearchService {
    searchJobs(jobs: Job[], text: string): Job[];
    filterByExperience(jobs: Job[], level: string): Job[];
    filterByTechnology(jobs: Job[], technology: string): Job[];
    filterByMinSalary(jobs: Job[], minSalary: number): Job[];
}

// Interface para aplicación a empleo
export interface JobApplication {
    id: string;
    jobId: string;
    candidateId: string;
    status: ApplicationStatus;
    appliedDate: Date;
    coverLetter?: string;
}

// Interface que extiende Job con propiedades adicionales
export interface DetailedJob extends Job {
    benefits: string[];
    requirements: string[];
    applicationDeadline?: Date;
}

export const searchService: JobSearchService = {
    searchJobs,
    filterByExperience,
    filterByMinSalary,
    filterByTechnology,
};
