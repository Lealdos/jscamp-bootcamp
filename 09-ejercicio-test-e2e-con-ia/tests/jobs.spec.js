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

/*  Tercer ejercicio: Test de búsqueda de empleos


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

/*  Cuarto ejercicio: Test de flujo completo de aplicación

 */

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

/*  Quinto ejercicio: Test de filtros


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

/*  Sexto ejercicio: Test de paginación

    */

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

/*

 Séptimo ejercicio: Test de detalle de empleo



   */

test('job detail and apply', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'Iniciar sesion' }).click();
    const searchBox = page.getByRole('searchbox');
    await searchBox.fill('python');
    await searchBox.press('Enter');
    await expect(page).toHaveURL(/search\?text=python/);

    const firstJobCard = page.locator('.job-listing-card').first();
    await firstJobCard.locator('a').click();

    const sections = page.locator('section:has(h2)');
    const count = await sections.count();

    for (let i = 0; i < count; i++) {
        const section = sections.nth(i);

        await section.locator('h2').textContent();
        const items = section.locator('li');
        await items.count();
    }
    await page.getByRole('button', { name: 'Aplicar ahora' }).click();
    await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible();
});
