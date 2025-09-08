import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { buildChildRoutes } from '../utils/buildNavigation';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: buildChildRoutes(),
  },
]);


