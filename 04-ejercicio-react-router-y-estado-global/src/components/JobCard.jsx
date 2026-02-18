import { useState } from 'react';
import { Link } from './Link.jsx';
import { useFavoritesStore } from '../store/favoritesStore.js';

export function JobCard({ job }) {
    const [isApplied, setIsApplied] = useState(false);
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const isJobFavorite = isFavorite(job.id);

    const handleApplyClick = () => {
        setIsApplied(true);
    };

    const buttonClasses = isApplied
        ? 'button-apply-job is-applied'
        : 'button-apply-job';
    const buttonText = isApplied ? 'Aplicado' : 'Aplicar';
    const favoriteButtonClasses = isJobFavorite
        ? 'button-favorite is-favorite'
        : 'button-favorite';

    return (
        <article
            className='job-listing-card'
            data-modalidad={job.data.modalidad}
            data-nivel={job.data.nivel}
            data-technology={job.data.technology}
        >
            <div>
                <Link href={`/job/${job.id}`}>
                    <h3>{job.titulo}</h3>
                </Link>
                <small>
                    {job.empresa} | {job.ubicacion}
                </small>
                <p>{job.descripcion}</p>
            </div>
            <div className='job-card-actions'>
                <button
                    className={favoriteButtonClasses}
                    type='button'
                    onClick={() => toggleFavorite(job.id)}
                >
                    {isJobFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                </button>
                <button className={buttonClasses} onClick={handleApplyClick}>
                    {buttonText}
                </button>
            </div>
        </article>
    );
}
