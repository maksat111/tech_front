import { React, lazy, Suspense } from 'react';
import { Navigate, useRoutes } from "react-router-dom";
import Loading from '../components/Loading';
import PageLoading from '../components/PageLoading';

const Login = lazy(() => import('../pages/Admin/Login/Login'));
const Banners = lazy(() => import('../pages/Admin/Banners/Banners'));
const Brands = lazy(() => import('../pages/Admin/Brands/Brands'));
const Categories = lazy(() => import('../pages/Admin/Categories/Categories'));
const Clients = lazy(() => import('../pages/Admin/Clients/Clients'));
const Products = lazy(() => import('../pages/Admin/Products/Products'));
const Subcategories = lazy(() => import('../pages/Admin/Subcategories/Subcategories'));
const Users = lazy(() => import('../pages/Admin/Users/Users'));

const SideBarNavbar = lazy(() => import('./SidebarNavbar'));

function Router() {
    let routes = useRoutes([
        {
            element: <Suspense fallback={<PageLoading />}><Login /></Suspense>,
            path: '/admin',
        },
        {
            element: <Suspense fallback={<PageLoading />}><SideBarNavbar /></Suspense>,
            children: [
                {
                    element: <Suspense fallback={<Loading />}><Banners /></Suspense>,
                    path: '/admin/banners'
                },
                {
                    element: <Suspense fallback={<Loading />}><Brands /></Suspense>,
                    path: '/admin/brands'
                },
                {
                    element: <Suspense fallback={<Loading />}><Categories /></Suspense>,
                    path: '/admin/categories'
                },
                {
                    element: <Suspense fallback={<Loading />}><Clients /></Suspense>,
                    path: '/admin/clients'
                },
                {
                    element: <Suspense fallback={<Loading />}><Products /></Suspense>,
                    path: '/admin/products'
                },
                {
                    element: <Suspense fallback={<Loading />}><Subcategories /></Suspense>,
                    path: '/admin/subcategories'
                },
                {
                    element: <Suspense fallback={<Loading />}><Users /></Suspense>,
                    path: '/admin/users'
                },
            ]
        },
        {
            element: <Navigate to='/' />,
            path: '*'
        }
    ]);
    return routes;
}

export default Router;