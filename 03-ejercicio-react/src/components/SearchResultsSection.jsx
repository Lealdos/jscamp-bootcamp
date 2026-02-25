import { JobListings } from './JobListings';
import { Pagination } from './Pagination';

export function SearchResultsSection({
    jobs,
    currentPage,
    onPageChange,
    totalPages,
    loading,
}) {
    return (
        <section>
            <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Cargando empleos...</p>
                </div>
            ) : (
                <>
                    <JobListings jobs={jobs} />

                    {totalPages > 0 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                    )}
                </>
            )}
        </section>
    );
}
