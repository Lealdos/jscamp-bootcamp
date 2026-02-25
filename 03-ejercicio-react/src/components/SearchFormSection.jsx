import { useId } from 'react';

export function SearchFormSection({
    searchValue = '',
    onSearchChange,
    technologyValue = '',
    onTechnologyChange,
    locationValue = '',
    onLocationChange,
    levelValue = '',
    onLevelChange,
}) {
    const searchInputId = useId();
    const technologyFilterId = useId();
    const locationFilterId = useId();
    const experienceLevelFilterId = useId();

    const handleSearchInput = (e) => {
        e.preventDefault();
        onSearchChange(e.target.value);
    };

    const handleTechnologySelect = (e) => {
        e.preventDefault();

        onTechnologyChange(e.target.value);
    };

    const handleLocationSelect = (e) => {
        e.preventDefault();

        onLocationChange(e.target.value);
    };

    const handleLevelSelect = (e) => {
        e.preventDefault();

        onLevelChange(e.target.value);
    };

    return (
        <section className='jobs-search'>
            <h1>Encuentra tu próximo trabajo</h1>
            <p>Explora miles de oportunidades en el sector tecnológico.</p>

            <form
                id='empleos-search-form'
                role='search'
                onSubmit={(e) => e.preventDefault()}
            >
                <div className='search-bar'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                        <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                        <path d='M21 21l-6 -6' />
                    </svg>

                    <input
                        id={searchInputId}
                        type='text'
                        name={searchInputId}
                        placeholder='Buscar trabajos, empresas o habilidades'
                        value={searchValue}
                        onChange={handleSearchInput}
                    />
                </div>

                <div className='search-filters'>
                    <select
                        name={technologyFilterId}
                        id={technologyFilterId}
                        value={technologyValue}
                        onChange={handleTechnologySelect}
                    >
                        <option value=''>Tecnología</option>
                        <optgroup label='Tecnologías populares'>
                            <option value='javascript'>JavaScript</option>
                            <option value='python'>Python</option>
                            <option value='react'>React</option>
                            <option value='node'>Node.js</option>
                        </optgroup>
                        <option value='mobile'>Mobile</option>
                    </select>

                    <select
                        name={locationFilterId}
                        id={locationFilterId}
                        value={locationValue}
                        onChange={handleLocationSelect}
                    >
                        <option value=''>Ubicación</option>
                        <option value='remoto'>Remoto</option>
                        <option value='cdmx'>Ciudad de México</option>
                        <option value='guadalajara'>Guadalajara</option>
                        <option value='monterrey'>Monterrey</option>
                        <option value='barcelona'>Barcelona</option>
                        <option value='madrid'>Madrid</option>
                        <option value='valencia'>Valencia</option>
                        <option value='bogota'>Bogotá</option>
                        <option value='bsas'>Buenos Aires</option>
                        <option value='lima'>Lima</option>
                        <option value='santiago'>Santiago de Chile</option>
                    </select>

                    <select
                        name={experienceLevelFilterId}
                        id={experienceLevelFilterId}
                        value={levelValue}
                        onChange={handleLevelSelect}
                    >
                        <option value=''>Nivel de experiencia</option>
                        <option value='junior'>Junior</option>
                        <option value='mid-level'>Mid-level</option>
                        <option value='senior'>Senior</option>
                    </select>
                </div>
            </form>

            <span id='filter-selected-value'></span>
        </section>
    );
}
