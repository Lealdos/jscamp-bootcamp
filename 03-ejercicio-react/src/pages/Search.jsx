/* Pasa tu contenido de src/App.jsx aquí */
import { useState, useEffect } from 'react';

import { SearchFormSection } from '../components/SearchFormSection';
import { SearchResultsSection } from '../components/SearchResultsSection';
import { useDebounce } from '../hooks/useDebounce';
import { API_URL, JOBS_PER_PAGE } from '../const';

export function SearchPage() {
    /* Pasamos todos los defaultValue a funciones separadas del componente para que sea más fácil leer */
    const [filters, setFilters] = useState(getInitialFilters());
    const [textToFilter, setTextToFilter] = useState(getInitialTextToFilter());
    const [currentPage, setCurrentPage] = useState(getInitialCurrentPage());

    const [jobs, setJobs] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(false);

    const debouncedTextToFilter = useDebounce(textToFilter, 500);

    // Fetch de empleos desde la API
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const { params, setParam } = createAndSetParamIfExist();

                setParam('limit', JOBS_PER_PAGE);
                setParam('offset', (currentPage - 1) * JOBS_PER_PAGE);

                setParam('text', debouncedTextToFilter);
                setParam('technology', filters.technology);
                setParam('type', filters.location);
                setParam('level', filters.experienceLevel);

                const response = await fetch(`${API_URL}?${params.toString()}`);
                const fetchedData = await response.json();

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
    }, [
        debouncedTextToFilter,
        filters.technology,
        filters.location,
        filters.experienceLevel,
        currentPage,
    ]);

    // Sincronizar con la URL
    useEffect(() => {
        const { params, setParam } = createAndSetParamIfExist();
        
        setParam('text', debouncedTextToFilter);
        setParam('technology', filters.technology);
        setParam('type', filters.location);
        setParam('level', filters.experienceLevel);
        setParam('page', currentPage > 1 ? currentPage : 1);

        console.log('params', params)
        console.log('Actualizando URL con parámetros:', params.toString());

        const newUrl = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }, [
        debouncedTextToFilter,
        filters.technology,
        filters.location,
        filters.experienceLevel,
        currentPage,
    ]);

    // Leer parámetros iniciales de la URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setCurrentPage(parseInt(params.get('page') || currentPage, 10));
    }, [currentPage]);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [
    //     debouncedTextToFilter,
    //     filters.technology,
    //     filters.location,
    //     filters.experienceLevel,
    // ]);

    // Actualizar título de la página
    useEffect(() => {
        const pageInfo = currentPage > 1 ? `Página ${currentPage} | ` : '';
        const resultsInfo = totalJobs > 0 ? `Resultados ${totalJobs} | ` : '';
        document.title = `${resultsInfo}${pageInfo}DevJobs`;
    }, [totalJobs, currentPage]);

    const handleSearchChange = (value) => {
        setTextToFilter(value);
        setCurrentPage(1);
    };

    const handleTechnologyChange = (value) => {
        setFilters((prev) => ({ ...prev, technology: value }));
        setCurrentPage(1);
    };

    const handleLocationChange = (value) => {
        setFilters((prev) => ({ ...prev, location: value }));
        setCurrentPage(1);
    };

    const handleLevelChange = (value) => {
        setFilters((prev) => ({ ...prev, experienceLevel: value }));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

    return (
        <main>
            {/* Excelente! Estuviste muy bien creando funciones helpers en vez de mandar los setters de los estados :) */}
            <SearchFormSection
                searchValue={textToFilter}
                onSearchChange={handleSearchChange}
                technologyValue={filters.technology}
                onTechnologyChange={handleTechnologyChange}
                locationValue={filters.location}
                onLocationChange={handleLocationChange}
                levelValue={filters.experienceLevel}
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
    );
}

/* Hacemos esto para simplificar la lectura */
const createAndSetParamIfExist = () => {
    const params = new URLSearchParams(window.location.search);
    
    const setParam = (key, value) => {
        if (value) params.set(key, value);
        else params.delete(key);
    };

    return {
        params,
        setParam
    }
}; 

const getInitialFilters = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        technology: params.get('technology') || '',
        location: params.get('type') || '',
        experienceLevel: params.get('level') || '',
    };
}

const getInitialTextToFilter = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('text') || '';
}

const getInitialCurrentPage = () => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');

    if (!pageParam) return 1;

    const page = Number(pageParam);

    if (Number.isNaN(page) || page < 1) {
        return 1;
    }
    console.log('Página inicial desde URL:', page);
    return page;
}