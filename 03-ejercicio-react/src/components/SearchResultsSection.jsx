import { useEffect } from 'react';
import { JobListings } from './JobListings';
import { Pagination } from './Pagination';

export function SearchResultsSection({ jobs, currentPage, onPageChange }) {
    // Calcular el total de páginas (5 empleos por página)
    const jobsPerPage = 5;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(Math.max(currentPage, 1), totalPages)
            : currentPage;

    useEffect(() => {
        if (totalPages === 0) return;
        if (safeCurrentPage !== currentPage) {
            onPageChange(safeCurrentPage);
        }
    }, [currentPage, onPageChange, safeCurrentPage, totalPages]);

    // Obtener los empleos de la página actual
    const indexOfLastJob = safeCurrentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    return (
        <section>
            <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

            <JobListings jobs={currentJobs} />

            {totalPages > 0 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={safeCurrentPage}
                    onPageChange={onPageChange}
                />
            )}
        </section>
    );
}
