import { useMemo } from 'react';

export function useFilters(jobs, { searchText, technology, location, level }) {
    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const titleMatch = job.titulo
                .toLowerCase()
                .includes(searchText.toLowerCase());

            const descriptionMatch = job.descripcion
                .toLowerCase()
                .includes(searchText.toLowerCase());

            const companyMatch = job.empresa
                .toLowerCase()
                .includes(searchText.toLowerCase());

            const technologyMatch = technology
                ? job.data.technology === technology
                : true;

            const locationMatch = location
                ? job.data.modalidad === location
                : true;

            const levelMatch = level ? job.data.nivel === level : true;

            const textMatch = titleMatch || descriptionMatch || companyMatch;

            return textMatch && technologyMatch && locationMatch && levelMatch;
        });
    }, [jobs, searchText, technology, location, level]);

    return filteredJobs;
}
