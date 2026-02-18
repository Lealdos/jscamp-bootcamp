import { lazy, Suspense } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';

import { Route, Routes } from 'react-router';

const DetailsPage = lazy(() => import('./pages/Details.jsx'));
const HomePage = lazy(() => import('./pages/Home.jsx'));
const NotFoundPage = lazy(() => import('./pages/404.jsx'));
const SearchPage = lazy(() => import('./pages/Search.jsx'));

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/search' element={<SearchPage />} />
                <Route path='*' element={<NotFoundPage />} />
                <Route path='/job/:id' element={<DetailsPage />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
