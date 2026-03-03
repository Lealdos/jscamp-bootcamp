import { lazy, Suspense } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';

import { Route, Routes } from 'react-router';
import { Loader } from './components/Loader.jsx';

const DetailsPage = lazy(() => import('./pages/Details.jsx'));
const HomePage = lazy(() => import('./pages/Home.jsx'));
const NotFoundPage = lazy(() => import('./pages/404.jsx'));
const SearchPage = lazy(() => import('./pages/Search.jsx'));

function App() {
    return (
        <>
            <Header />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/search' element={<SearchPage />} />
                    <Route path='/job/:id' element={<DetailsPage />} />
                    {/* No está mal, pero siempre se suele dejar al final la ruta comodín o 404 (*) */}
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </Suspense>
            <Footer />
        </>
    );
}

export default App;
