/* la etiqueta con id="experience-level" no existía, la cambiamos por id="filter-experience-level", que si existe */
const experienceLevelFilter = document.querySelector('#filter-experience-level')
/* por convención, las variables se escriben en camelCase */
const locationFilter = document.querySelector('#filter-location')
const technologyFilter = document.querySelector('#filter-technology')
const searchFilter = document.querySelector('#empleos-search-input')
const form = document.querySelector('#empleos-search-form')

/*
Es interesante usar el `change` directamente en el form, pero hay unas cosas a tener en cuenta:

1. El evento change en el formulario se ejecuta cuando el valor de un elemento cambia y ese cambio se confirma. La manera de confirmarlo en los select es al seleccionar una opción. Pero, en un input, el evento change se ejecuta cuando se pierde el foco (es decir, cuando se sale del input), no cuando se escribe.

Por lo tanto, lo que hay que evitar es usar el `change` en el input desde el formulario. Esto lo has hecho bien.
Manejamos los select desde el form, y el input por separado desde el evento `change`.
*/
form.addEventListener('change', function (event) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget);
  const formValues = Object.fromEntries(formData.entries());

  const {
    technology,
    location,
    'experience-level': experienceLevel
  } = formValues

  const jobsListingCards = document.querySelectorAll('.job-listing-card')

  jobsListingCards.forEach(article => {
    /* obtenemos los valores desde los dataset */
    const technologyValue = article?.dataset.technology;
    const locationValue = article?.dataset.modalidad;
    const experienceLevelValue = article?.dataset.nivel;

    /* verificamos si el valor es vacio o si coincide con el valor del dataset */
    const hasFoundTechnology = technology === '' || technologyValue.toLocaleLowerCase().includes(technology)
    const hasFoundLocation = location === '' || locationValue.toLocaleLowerCase().includes(location)
    const hasFoundExperienceLevel = experienceLevel === '' || experienceLevelValue === experienceLevel

    /* simplificamos la lógica, si todos los valores coinciden, se muestra el artículo */
    article.style.display = hasFoundTechnology && hasFoundLocation && hasFoundExperienceLevel ? 'flex' : 'none'
  })
})

/* filtro del input */
searchFilter.addEventListener('input', debounce(function (evt) {
  const jobsListingCards = document.querySelectorAll('.job-listing-card')

  jobsListingCards.forEach(article => {
    /* separamos un poco la lógica */
    const title = article?.querySelector('h3')

    /* agrupamos las variables que vamos a comparar para que sea mas facil leerlas */
    const searchValue = evt.target.value.toLowerCase()
    const titleValue = title?.textContent?.toLowerCase()

    const hasFoundJob = titleValue.includes(searchValue)

    /* cambiamos el if y lo hacemos en una linea, separando la lógica en una variable (findTitle) */
    article.style.display = hasFoundJob ? 'flex' : 'none'
  })
}))

/* Excelente! Solo lo bajamos para que no quede entre medio de los addEventListener */
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

// function displayJobsFiltered(filterElement, HTMLelementToFilter) {
//   const jobsListingCards = document.querySelectorAll('.job-listing-card')


//   jobsListingCards.forEach(article => {
//     const searchFilter = article?.querySelector(HTMLelementToFilter)?.textContent?.toLowerCase()

//     const technologyFilter = article?.dataset.technology;
//     console.log('antes', technologyFilter)
//     const clearTech = technologyFilter.split(',')
//     console.log('despues', clearTech)

//     const locationFilter = article?.dataset.modalidad;
//     const experienceLevelFilter = article?.dataset.nivel;

//     if (searchFilter.includes(filterElement)) {
//       article.style.display = 'flex';
//     } else {
//       article.style.display = 'none';
//     }

//     if (locationFilter.toLocaleLowerCase().includes(filterElement)) {
//       article.style.display = 'flex';
//     } else {
//       article.style.display = 'none';
//     }
//     if (technologyFilter.toLocaleLowerCase().includes(filterElement)) {
//       article.style.display = 'flex';
//     } else {
//       article.style.display = 'none';
//     }
//     if (experienceLevelFilter === filterElement) {
//       article.style.display = 'flex';
//     } else {
//       article.style.display = 'none';
//     }
//   });

//   if (filterElement === '') {

//     article.style.display = 'flex';
//   }

// }



// technologyFilter.addEventListener('change', function () {
//   const technologyFilterSelected = technologyFilter.value.toLowerCase()
//   displayJobsFiltered(technologyFilterSelected, 'p')

// })


// LocationFilter.addEventListener('change', function () {
//   let jobFilterLocationValue = LocationFilter.value.toLowerCase()
//   if (jobFilterLocationValue === 'cdmx') {
//     jobFilterLocationValue = 'Ciudad de México'.toLocaleLowerCase()
//   }

//   displayJobsFiltered(jobFilterLocationValue, 'small')

// })






