import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { buildChildRoutes } from '../config/siteMap';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: buildChildRoutes(),
  },
]);


