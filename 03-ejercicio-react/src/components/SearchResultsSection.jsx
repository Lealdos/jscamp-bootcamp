import { useState } from 'react';
import jobs from '../data.json';
import { JobListings } from './JobListings';
import { Pagination } from './Pagination';

export function SearchResultsSection() {
    const [currentPage, setCurrentPage] = useState(1);

    // Calcular el total de páginas (5 empleos por página)
    const jobsPerPage = 5;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    // Obtener los empleos de la página actual
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <section>
            <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

            <JobListings jobs={currentJobs} />

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </section>
    );
}
