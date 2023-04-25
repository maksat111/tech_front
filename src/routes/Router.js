import { React, lazy, Suspense } from 'react';
import { Navigate, useRoutes } from "react-router-dom";
import Loading from '../components/Loading';
import PageLoading from '../components/PageLoading';

const Login = lazy(() => import('../pages/Login/Login'));
const Banners = lazy(() => import('../pages/Banners/Banners'));
const Sections = lazy(() => import('../pages/Sections/Sections'));
const News = lazy(() => import('../pages/News/News'));
const Users = lazy(() => import('../pages/Users/Users'));
const AboutUs = lazy(() => import('../pages/AboutUs/AboutUs'));

const SideBarNavbar = lazy(() => import('./SidebarNavbar'));

function Router() {
    let routes = useRoutes([
        {
            element: <Suspense fallback={<PageLoading />}><Login /></Suspense>,
            path: '/',
        },
        {
            element: <Suspense fallback={<PageLoading />}><SideBarNavbar /></Suspense>,
            children: [
                // {
                //     element: <Suspense fallback={<Loading />}><Banners /></Suspense>,
                //     path: '/banners'
                // },
                {
                    element: <Suspense fallback={<Loading />}><Sections /></Suspense>,
                    path: '/sections'
                },
                {
                    element: <Suspense fallback={<Loading />}><News /></Suspense>,
                    path: '/news'
                },
                {
                    element: <Suspense fallback={<Loading />}><Users /></Suspense>,
                    path: '/users'
                },
                {
                    element: <Suspense fallback={<Loading />}><AboutUs /></Suspense>,
                    path: '/aboutUs'
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