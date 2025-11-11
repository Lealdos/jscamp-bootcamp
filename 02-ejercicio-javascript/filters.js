const experienceLevelFilter = document.querySelector('#experience-level')
const LocationFilter = document.querySelector('#filter-location')
const technologyFilter = document.querySelector('#filter-technology')




const searchFilter = document.querySelector('#empleos-search-input')




const form = document.querySelector('#empleos-search-form')
form.addEventListener('change', function (event) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget);
  const formValues = Object.fromEntries(formData.entries());
  console.log(formValues)
  const { technology, location, 'experience-level': experienceLevel,search } = formValues
  const jobsListingCards = document.querySelectorAll('.job-listing-card')
  console.log('tech: ',technology,'ubicacion: ', location,'experience: ', experienceLevel, search)

  if (experienceLevel ==='Ciudad de México'){
    location = 'cdmx'
  }


  if (technology === '' && location === '' && experienceLevel === '' && search === '') {
    jobsListingCards.forEach(article => {
      article.style.display = 'flex';
    });
    return;
  }

  jobsListingCards.forEach(article => {
    const locationFilter = article?.dataset.modalidad.toLowerCase() || '';
    const experienceLevelFilter = article?.dataset.nivel.toLowerCase() || '';

    const technologyFilter = article?.dataset.technology || '';
    const clearTech = technologyFilter.split(','); // in case we have more then one technology

    const matchTechnology = technology === '' || clearTech.some(tech => technology.includes(tech.toLowerCase().trim()));
    const matchLocation = location === '' || location.includes(locationFilter.toLowerCase());
    const matchExperienceLevel = experienceLevel === '' || experienceLevel.includes(experienceLevelFilter);



    if (matchTechnology && matchLocation && matchExperienceLevel ) {
      article.style.display = 'flex';
    } else {
      article.style.display = 'none';
    }

  })



})



function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}


searchFilter.addEventListener('input', debounce(function (event) {

  const searchFilterValue = searchFilter.value.toLowerCase()
  const jobsListingCards = document.querySelectorAll('.job-listing-card')
  jobsListingCards.forEach(article => {
    const searchFilter = article?.querySelector('h3')?.textContent?.toLowerCase()
    if (searchFilter.includes(searchFilterValue)) {
      article.style.display = 'flex';
    } else {
      article.style.display = 'none';
    }
  }
  )

}))

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






