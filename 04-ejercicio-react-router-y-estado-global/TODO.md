# TODO

## 1) Configurar React Router

- [ ✔️] Instalar React Router (npm i react-router)
- [ ✔️] En main.jsx, envolver la app con BrowserRouter
- [✔️ ] En App.jsx, crear rutas con Routes/Route para / y /search
- [ ✔️] Modificar el componente Link para usar Link de React Router internamente
- [✔️ ] Modificar el hook useRouter para usar useNavigate y useLocation con la misma interfaz

## 2) Crear pagina de Detalles

- [ ✔️] Crear src/pages/Detail.jsx
- [ ✔️] Crear la ruta /job/:id en App.jsx
- [ ✔️] En JobCard, agregar acceso al detalle usando Link sin romper el boton de aplicar
- [✔️ ] En Detail, usar useParams para leer el id
- [✔️ ] Hacer fetch a https://jscamp-api.vercel.app/api/jobs/:id
- [✔️ ] Convertir el markdown a HTML con snarkdown y renderizarlo con dangerouslySetInnerHTML

## 3) Sincronizacion de filtros con useSearchParams

- [✔️ ] Leer filtros desde la URL con useSearchParams
- [✔️ ] Actualizar la URL cuando cambien los filtros
- [✔️ ] Persistir estado de filtros al recargar la pagina
- [✔️ ] Mantener el select sincronizado con el filtro actual (ej: react)

## 4) Optimizacion

- [ ✔️] Cargar paginas con React.lazy
- [ ✔️] Envolver rutas con Suspense
- [ ✔️] Mostrar un loader mientras se carga la pagina

## 5) Mejoras en la UI

- [ ✔️] Usar NavLink en el menu principal
- [ ✔️] Aplicar estilos a links activos
- [ ✔️] En Header, agregar boton "Iniciar sesion"
- [ ✔️] En JobCard, agregar boton "Agregar a favoritos"

## 6) Estado global con Zustand

- [ ✔️] Instalar Zustand (npm i zustand)
- [✔️ ] Crear src/store/authStore.js con isLoggedIn, login, logout
- [ ✔️] Crear src/store/favoritesStore.js con favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite
- [ ✔️] Conectar boton login/logout a useAuthStore
- [ ✔️] Conectar favoritos a useFavoritesStore y reflejar estado en el boton
