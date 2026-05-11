import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import MuseumListPage from '../pages/MuseumListPage';
import MuseumDetailPage from '../pages/MuseumDetailPage';
import NationalMapPage from '../pages/NationalMapPage';
import NationalGraphPage from '../pages/NationalGraphPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'museums', element: <MuseumListPage /> },
      { path: 'museums/:id', element: <MuseumDetailPage /> },
      { path: 'national-map', element: <NationalMapPage /> },
      { path: 'national-graph', element: <NationalGraphPage /> },
    ],
  },
]);
