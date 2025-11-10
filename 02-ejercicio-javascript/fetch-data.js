/* Aquí va la lógica para mostrar los resultados de búsqueda */



const jobsListingSection = document.querySelector('.jobs-listings')



const FetchData = fetch('./data.json')

const article = FetchData.then(response => response.json()).then((jobs) => {
    jobs.forEach(job => {

        const jobListingCard = document.createElement('article')

        jobListingCard.className = 'job-listing-card'
        jobListingCard.dataset.modalidad = job.data.modalidad
        jobListingCard.dataset.nivel = job.data.nivel
        jobListingCard.dataset.technology = job.data.technology
        jobListingCard.innerHTML = `<article class="job-listing-card">
          <div>
            <a href="trabajos-id-${job.id}.html"> 
            <h3>${job.titulo}</h3>
              <small>${job.empresa} | ${job.ubicacion}.</small>
            </a>
              <p>${job.descripcion}</p>
              </div>
              <button class="button-apply-job" id="boton-importante">Aplicar</button>
        </article>`
        jobsListingSection.appendChild(jobListingCard)
    })
})


