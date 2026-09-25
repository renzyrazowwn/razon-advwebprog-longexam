import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// HomePage Structure
import Layout from './layouts/Layout';
import ProductPage from './pages/LandingPages/ProductPage';
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ProductListPage from './pages/LandingPages/ProductListPage';

// Auth Pages Structure
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

// Customer Pages Structure (RBAC: Customer)
import CartPage from './pages/CustomerPages/CartPage';
import OrdersPage from './pages/CustomerPages/OrdersPage';
import ProfilePage from './pages/CustomerPages/ProfilePage';

// Admin Pages Structure (RBAC: Admin)
import AdminLayout from './layouts/AdminLayout';
import AdminProductsPage from './pages/AdminPages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminPages/AdminOrdersPage';
import AdminReviewsPage from './pages/AdminPages/AdminReviewsPage';
import AdminUsersPage from './pages/AdminPages/AdminUsersPage';

import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:id',
        element: <ProductPage />,
      },
      // Any signed-in user (Customer or Admin)
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'account/profile', element: <ProfilePage /> },
        ],
      },
      // Customer-only routes
      {
        element: <ProtectedRoute roles={['Customer']} />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'orders', element: <OrdersPage /> },
        ],
      },
      // Admin-only routes (still inside Layout, so NavBar/Footer stay consistent)
      {
        element: <ProtectedRoute roles={['Admin']} />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: [
              { path: 'products', element: <AdminProductsPage /> },
              { path: 'orders', element: <AdminOrdersPage /> },
              { path: 'reviews', element: <AdminReviewsPage /> },
              { path: 'users', element: <AdminUsersPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'auth/',
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
