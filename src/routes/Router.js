import { React, lazy, Suspense } from 'react';
import { Navigate, useRoutes } from "react-router-dom";
import Loading from '../components/Loading';
import PageLoading from '../components/PageLoading';

const Login = lazy(() => import('../pages/Admin/Login/Login'));
const Banners = lazy(() => import('../pages/Admin/Banners/Banners'));
const Sections = lazy(() => import('../pages/Admin/Sections/Sections'));
const News = lazy(() => import('../pages/Admin/News/News'));
const Users = lazy(() => import('../pages/Admin/Users/Users'));
const AboutUs = lazy(() => import('../pages/Admin/AboutUs/AboutUs'));

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
                    element: <Suspense fallback={<Loading />}><Sections /></Suspense>,
                    path: '/admin/sections'
                },
                {
                    element: <Suspense fallback={<Loading />}><News /></Suspense>,
                    path: '/admin/news'
                },
                {
                    element: <Suspense fallback={<Loading />}><Users /></Suspense>,
                    path: '/admin/users'
                },
                {
                    element: <Suspense fallback={<Loading />}><AboutUs /></Suspense>,
                    path: '/admin/aboutUs'
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