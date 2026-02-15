import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/Home';
import { useState, useEffect } from 'react';
import { SearchPage } from './pages/Search';
function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);

    return (
        <div>
            <Header />
            <main>
                {currentPath === '/' && <HomePage />}
                {currentPath === '/search' && <SearchPage />}
            </main>
            <Footer />
        </div>
    );
}

export default App;
