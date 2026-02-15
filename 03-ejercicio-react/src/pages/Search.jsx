/* Pasa tu contenido de src/App.jsx aquí */
import { useState, useEffect } from 'react';

import { SearchFormSection } from '../components/SearchFormSection';
import { SearchResultsSection } from '../components/SearchResultsSection';
import { useDebounce } from '../hooks/useDebounce';
import { API_URL, JOBS_PER_PAGE } from '../const';

export function SearchPage() {
    const [searchInput, setSearchInput] = useState('');
    const [technology, setTechnology] = useState('');
    const [location, setLocation] = useState('');
    const [level, setLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jobs, setJobs] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(false);

    const debouncedSearchInput = useDebounce(searchInput, 500);

    // Fetch de empleos desde la API
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('limit', JOBS_PER_PAGE);
                params.set('offset', (currentPage - 1) * JOBS_PER_PAGE);

                if (debouncedSearchInput)
                    params.set('text', debouncedSearchInput);
                if (technology) params.set('technology', technology);
                if (location) params.set('type', location);
                if (level) params.set('level', level);

                const response = await fetch(`${API_URL}?${params.toString()}`);
                const fetchedData = await response.json();

                console.log('API Response:', fetchedData);

                // La API puede devolver { results: [], total: 0 } o directamente un array
                if (Array.isArray(await fetchedData.data)) {
                    setJobs(fetchedData.data);
                    setTotalJobs(fetchedData.total);
                } else {
                    setJobs([]);
                    setTotalJobs(0);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setJobs([]);
                setTotalJobs(0);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [debouncedSearchInput, technology, location, level, currentPage]);

    // Sincronizar con la URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearchInput) params.set('text', debouncedSearchInput);
        if (technology) params.set('technology', technology);
        if (location) params.set('type', location);
        if (level) params.set('level', level);
        if (currentPage > 1) params.set('page', currentPage);

        const newUrl = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }, [debouncedSearchInput, technology, location, level, currentPage]);

    // Leer parámetros iniciales de la URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSearchInput(params.get('text') || '');
        setTechnology(params.get('technology') || '');
        setLocation(params.get('type') || '');
        setLevel(params.get('level') || '');
        setCurrentPage(parseInt(params.get('page') || '1', 10));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchInput, technology, location, level]);

    // Actualizar título de la página
    useEffect(() => {
        const pageInfo = currentPage > 1 ? `Página ${currentPage} | ` : '';
        const resultsInfo = totalJobs > 0 ? `Resultados ${totalJobs} | ` : '';
        document.title = `${resultsInfo}${pageInfo}DevJobs`;
    }, [totalJobs, currentPage]);

    const handleSearchChange = (value) => {
        setSearchInput(value);
    };

    const handleTechnologyChange = (value) => {
        setTechnology(value);
    };

    const handleLocationChange = (value) => {
        setLocation(value);
    };

    const handleLevelChange = (value) => {
        setLevel(value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

    return (
        <>
            <main>
                <SearchFormSection
                    searchValue={searchInput}
                    onSearchChange={handleSearchChange}
                    technologyValue={technology}
                    onTechnologyChange={handleTechnologyChange}
                    locationValue={location}
                    onLocationChange={handleLocationChange}
                    levelValue={level}
                    onLevelChange={handleLevelChange}
                />
                <SearchResultsSection
                    jobs={jobs}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                    loading={loading}
                />
            </main>
        </>
    );
}
