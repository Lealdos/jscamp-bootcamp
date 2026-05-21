/* Aquí irá el código de tu test */

import { test, expect } from '@playwright/test';

test('Check if the page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/infojobs/);
});

test('able to login', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Siempre es mejor usar regex, por si en un futuro cambia una mayuscula, etc.
    await page.getByRole('button', { name: /iniciar sesion/i }).click();
    // Verificamos que el boton de cerrar sesion sea visible
    await expect(page.getByRole('button', { name: /cerrar sesion/i })).toBeVisible();
    // Verificamos que el boton de iniciar sesion no sea visible
    await expect(page.getByRole('button', { name: /iniciar sesion/i })).toBeHidden();
});

test('check if a search box is present', async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Si queremos obtener un input, la mejor práctica (un grado más alto que `getByRole`) es usar `getByLabelText`, esto es para:
    // 1. Obligarnos a usar un `label` en los inputs, que es buena práctica para accesibilidad
    // 2. Hacer que el test sea más específico y robusto, podemos tener muchos `searchbox` en la página, pero solo uno con el label "Buscar empleos"
    await expect(page.getByLabel(/Buscar empleos/i)).toBeVisible();
});

/*  Tercer ejercicio: Test de búsqueda de empleos


*/
test('search for jobs by technology', async ({ page }) => {
    // Podemos pasar la variable como parámetro al test, para que sea más flexible
    const TEXT_TO_SEARCH = 'React';

    await page.goto('http://localhost:5173');
    // Podemos buscar por `label`
    const searchBox = page.getByLabel(/Buscar empleos/i);
    await searchBox.fill(TEXT_TO_SEARCH);
    await searchBox.press('Enter');

    await expect(page).toHaveURL(new RegExp(`search\\?text=${TEXT_TO_SEARCH}`));

    // No es recomendable obtener elementos por nombre de class. Vamos a usar role
    // const jobCards = page.locator('.job-listing-card');
    const jobCards = page.getByRole('article');

    // Verificamos que el primer elemento existe
    await expect(jobCards.first()).toBeVisible();
    
    const firstCard = jobCards.first();

    // Obtenemos el contenido del heading y de la descripción
    const heading = await firstCard.getByRole('heading').textContent();
    const description = await firstCard.locator('p').textContent();
    
    // Verificamos que el texto buscado esté en el heading o en la descripción
    expect(`${heading} ${description}`).toContain(TEXT_TO_SEARCH);

    // await expect(jobCards.first()).toBeVisible();
});

/*  Cuarto ejercicio: Test de flujo completo de aplicación

 */

test('complete application flow', async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Podemos aplicar los mismos cambios que en los tests anteriores.
    // Es una alternativa, ambas son válidas.
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('JavaScript');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=JavaScript/);
    const firstJobCard = page.locator('.job-listing-card').first();

    // Verificamos que el botón de aplicar está desactivado antes de iniciar sesión
    await expect(firstJobCard.getByRole('button', { name: 'Aplicar' })).toBeDisabled();

    await page.getByRole('button', { name: 'Iniciar sesion' }).click();

    // Verificamos que el botón de aplicar está activo después de iniciar sesión
    await expect(firstJobCard.getByRole('button', { name: 'Aplicar' })).toBeEnabled();
    await firstJobCard.getByRole('button', { name: 'Aplicar' }).click();
    
    await expect(
        firstJobCard.getByRole('button', { name: 'Aplicado' }),
    ).toBeVisible();
});

/*  Quinto ejercicio: Test de filtros


    */

test('filter by location', async ({ page }) => {
    await page.goto('http://localhost:5173/search');

    // En vez de agarrar por ID, podemos usar `getByRole`
    // await page.locator('#filter-location').selectOption({ label: 'Remoto' });
    await page.getByRole('combobox', { name: /ubicación/i }).selectOption({ label: 'Remoto' });

    // Lo mismo aquí, en vez de agarrar por clase, podemos usar `getByRole`
    // const jobCards = page.locator('.job-listing-card');
    const jobCards = page.getByRole('article').filter({ hasText: /Remoto/i });

    const count = await jobCards.count();

    for (let i = 0; i < count; i++) {
        await expect(jobCards.nth(i)).toHaveText(/Remoto/);
    }
});

test('filter by level', async ({ page }) => {
    await page.goto('http://localhost:5173/search');

    await page
        .getByRole('combobox', { name: /nivel de experiencia/i })
        .selectOption({ label: 'Senior' });

    const jobCards = page.getByRole('article').filter({ hasText: /Senior/i });
    const count = await jobCards.count();

    for (let i = 0; i < count; i++) {
        await expect(jobCards.nth(i)).toHaveText(/Senior/);
    }
});

test('filter by technology', async ({ page }) => {
    await page.goto('http://localhost:5173/search');

    await page
        .getByRole('combobox', { name: /tecnología/i })
        .selectOption({ label: 'JavaScript' });

    const jobCards = page.getByRole('article').filter({ hasText: /JavaScript/i });
    const count = await jobCards.count();

    for (let i = 0; i < count; i++) {
        await expect(jobCards.nth(i)).toHaveText(/JavaScript/);
    }
});

/*  Sexto ejercicio: Test de paginación

    */

test('pagination appears with many results', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.getByRole('searchbox').fill('Developer');
    await page.getByRole('searchbox').press('Enter');

    await expect(page).toHaveURL(/search\?text=Developer/);

    // const jobCards = page.locator('.job-listing-card');
    const jobCards = page.getByRole('article');

    await expect(jobCards.first()).toBeVisible();

    const count = await jobCards.count();

    expect(count).toBeGreaterThan(3);

    await expect(page.getByTestId('pagination')).toBeVisible();
});

test('navigate to next page with a previous search', async ({ page }) => {
    await page.goto('http://localhost:5173');
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('python');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=python/);

    await expect(page.getByTestId('pagination')).toBeVisible();
    // Todo esto podemos pasarlo a un `getByRole('button', { name: /siguiente/i })`
    // Aplicando un aria-label en los inuts.
    // Y si son los botones que no tienen texto, y tienen un SVG. se puede hacer algo así:
    /* 
        <button>
            <svg
                ...
                aria-labelledby="btn-title"
            >
            <title id="btn-title">Submit</title>
            ...
        </button>

        page.getByRole("button", { name: /Submit/i })
    */

    await page.getByTestId('next-button').click();
    await expect(page).toHaveURL(/search\?text=python&page=2/);
});

test('navigate back to previous page', async ({ page }) => {
    // Lo mismo que en el test anterior, pero con `getByRole('button', { name: /anterior/i })`
    await page.goto('http://localhost:5173');
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('python');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=python/);

    await expect(page.getByTestId('pagination')).toBeVisible();
    await page.getByTestId('next-button').click();
    await expect(page).toHaveURL(/search\?text=python&page=2/);
    await page.getByTestId('previous-button').click();
    await expect(page).toHaveURL(/search\?text=python/);
});

// Séptimo ejercicio: Test de detalle de empleos

test('job detail and apply', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();
    // Podemos aplicar lo mencionado en otros ejercicios
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('python');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=python/);

    const firstJobCard = page.locator('.job-listing-card').first();
    // Aquí podemos usar un firstJobCard.getByRole("link", { name: /Texto del link si hace falta/i })
    await firstJobCard.locator('a').click();

    const sections = page.locator('section:has(h2)');
    const count = await sections.count();

    for (let i = 0; i < count; i++) {
        const section = sections.nth(i);

        /* Podemos usar un `heading` */
        await section.getByRole('heading', {
            level: 2 // <- Esto indica que es un `h2`
        }).textContent();
        // await section.locator('h2').textContent();
        // Podemos aplicar un `list` para contar los elementos
        const items = page.getByRole('list');
        // const items = section.locator('li');
        await items.count();
    }
    await page.getByRole('button', { name: 'Aplicar ahora' }).click();
    await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible();
});
