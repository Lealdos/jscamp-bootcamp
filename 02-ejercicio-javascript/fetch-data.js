/* Aquí va la lógica para mostrar los resultados de búsqueda */
const jobsListingSection = document.querySelector('.jobs-listings')

/* No hace falta guardar el fetch en una variable, si no retornamos ningún valor para luego usar */
fetch('./data.json').then(response => response.json()).then((jobs) => {
      /* 
    Creamos un DocumentFragment para mejorar el rendimiento.
    En lugar de agregar cada trabajo directamente al DOM (lo que haría que el navegador redibuje la página múltiples veces), guardamos todos los elementos en memoria primero. Al final, agregamos todo de una sola vez.
    
    Es como preparar todos los platos en la cocina antes de llevarlos a la mesa, en vez de hacer un viaje por cada plato, llevamos todos juntos, y es mejor :)

    Esto viene muy bien cuando tenemos muchos elementos que agregar al DOM.
    */
    const fragment = document.createDocumentFragment()
    jobs.forEach(job => {
        const jobListingCard = document.createElement('li')

        jobListingCard.className = 'job-listing-card'
        jobListingCard.dataset.modalidad = job.data.modalidad
        jobListingCard.dataset.nivel = job.data.nivel
        jobListingCard.dataset.technology = job.data.technology
        jobListingCard.innerHTML = `
          <article>
            <a href="trabajos-id-${job.id}.html"> 
            <h3>${job.titulo}</h3>
              <small>${job.empresa} | ${job.ubicacion}.</small>
            </a>
              <p>${job.descripcion}</p>
              </article>
              <button class="button-apply-job" >Aplicar</button>
        `
        fragment.appendChild(jobListingCard)
    })
    jobsListingSection.appendChild(fragment)
})

