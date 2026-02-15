/* Pasa tu contenido de src/App.jsx aquí */
import { useState, useEffect } from 'react';

import { SearchFormSection } from '../components/SearchFormSection';
import { SearchResultsSection } from '../components/SearchResultsSection';
import { useDebounce } from '../hooks/useDebounce';
import { useFilters } from '../hooks/useFilters';
import jobs from '../data.json';

export function SearchPage() {
    const [searchInput, setSearchInput] = useState('');
    const [technology, setTechnology] = useState('');
    const [location, setLocation] = useState('');
    const [level, setLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearchInput = useDebounce(searchInput, 500);

    const filteredJobs = useFilters(jobs, {
        searchText: debouncedSearchInput,
        technology,
        location,
        level,
    });

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
                    jobs={filteredJobs}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </main>
        </>
    );
}
