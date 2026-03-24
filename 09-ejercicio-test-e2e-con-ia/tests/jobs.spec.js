/* Aquí irá el código de tu test */

import { test, expect } from '@playwright/test';

test('Check if the page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/infojobs/);
});

test('able to login', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();
});

test('check if a search box is present', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.getByRole('searchbox')).toBeVisible();
});

/* ### Tercer ejercicio: Test de búsqueda de empleos

Escribe un test que simule a un usuario buscando empleos por tecnología.
1. Navegar a la página principal
2. Localizar el input de búsqueda usando `getByRole('searchbox')`
3. Escribir "React" en el buscador
4. Hacer clic en el botón "Buscar"
5. Verificar que aparecen resultados
6. Verificar que al menos el primer resultado es visible

*/
test('search for jobs by technology', async ({ page }) => {
    await page.goto('http://localhost:5173');
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('React');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=React/);
    const jobCards = page.locator('.job-listing-card');
    await expect(jobCards.first()).toBeVisible();
});

/* ### Cuarto ejercicio: Test de flujo completo de aplicación

Escribe un test que simule el flujo completo de un usuario aplicando a una oferta.

#### Requisitos

El test debe simular estos pasos:

1. Buscar empleos con "JavaScript"
2. Hacer clic en el primer resultado
3. Verificar que se muestra el detalle del empleo
4. Hacer clic en "Iniciar sesión"
5. Hacer clic en "Aplicar"
6. Verificar que el botón cambia a "Aplicado" */

test('complete application flow', async ({ page }) => {
    await page.goto('http://localhost:5173');
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('JavaScript');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=JavaScript/);
    const firstJobCard = page.locator('.job-listing-card').first();
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();
    await firstJobCard.getByRole('button', { name: 'Aplicar' }).click();
    await expect(
        firstJobCard.getByRole('button', { name: 'Aplicado' }),
    ).toBeVisible();
});

/* ### Quinto ejercicio: Test de filtros

 Escribe tests que verifiquen los filtros de la aplicación.

    */

test('filter by location', async ({ page }) => {
    await page.goto('http://localhost:5173/search');

    await page.locator('#filter-location').selectOption({ label: 'Remoto' });

    const jobCards = page.locator('.job-listing-card');
    const count = await jobCards.count();

    for (let i = 0; i < count; i++) {
        await expect(jobCards.nth(i)).toHaveText(/Remoto/);
    }
});

test('filter by level', async ({ page }) => {
    await page.goto('http://localhost:5173/search');

    await page
        .locator('#filter-experience-level')
        .selectOption({ label: 'Senior' });

    const jobCards = page.locator('.job-listing-card');
    const count = await jobCards.count();

    for (let i = 0; i < count; i++) {
        await expect(jobCards.nth(i)).toHaveText(/Senior/);
    }
});

test('filter by technology', async ({ page }) => {
    await page.goto('http://localhost:5173/search');

    await page
        .locator('#filter-technology')
        .selectOption({ label: 'JavaScript' });

    const jobCards = page.locator('.job-listing-card');
    const count = await jobCards.count();

    for (let i = 0; i < count; i++) {
        await expect(jobCards.nth(i)).toHaveText(/React/);
    }
});

// /*
// ### Sexto ejercicio: Test de paginación

// Escribe un test que verifique la paginación de resultados.

// #### Requisitos

// 1. **Verificar que aparece paginación si hay más de x resultados**
//    - Hacer una búsqueda que devuelva más de x resultados
//    - Verificar que aparece el componente de paginación

// 2. **Navegar a la siguiente página**
//    - Hacer clic en "Siguiente"
//    - Verificar que cambian los resultados

//    */

test('pagination appears with many results', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.getByRole('searchbox').fill('Developer');
    await page.getByRole('searchbox').press('Enter');

    await expect(page).toHaveURL(/search\?text=Developer/);

    const jobCards = page.locator('.job-listing-card');

    await expect(jobCards.first()).toBeVisible();

    const count = await jobCards.count();

    expect(count).toBeGreaterThan(3);

    await expect(page.getByTestId('pagination')).toBeVisible();
});

test('navigate to next page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('Developer');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=Developer/);

    await expect(page.getByTestId('pagination')).toBeVisible();
    await page.getByTestId('next-button').click();
    await expect(page).toHaveURL(/search\?text=Developer&page=2/);
});
