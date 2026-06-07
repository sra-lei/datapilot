/**
 * 路由配置
 */

import { createBrowserRouter, RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import DatabaseViewer from '../pages/DatabaseViewer';
import UserManagement from '../pages/Users';
import SystemSettings from '../pages/Settings';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/database',
        element: <DatabaseViewer />,
      },
      {
        path: '/users',
        element: <UserManagement />,
      },
      {
        path: '/settings',
        element: <SystemSettings />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
