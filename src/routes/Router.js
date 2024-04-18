import { React, lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Loading from "../components/Loading";
import PageLoading from "../components/PageLoading";

const Login = lazy(() => import("../sections/Admin/Login/Login"));
const Banners = lazy(() => import("../sections/Admin/Banners/Banners"));
const Brands = lazy(() => import("../sections/Admin/Brands/Brands"));
const Categories = lazy(() =>
  import("../sections/Admin/Categories/Categories")
);
const Clients = lazy(() => import("../sections/Admin/Clients/Clients"));
const Products = lazy(() => import("../sections/Admin/Products/Products"));
const Subcategories = lazy(() =>
  import("../sections/Admin/Subcategories/Subcategories")
);
const Users = lazy(() => import("../sections/Admin/Users/Users"));
const SideBarNavbar = lazy(() => import("./SidebarNavbar"));
//Client
const Navbar = lazy(() => import("./ClientNavbar"));
const Home = lazy(() => import("../sections/Client/Home"));
const CategoryDetails = lazy(() =>
  import("../sections/Client/CategoryDetails")
);
const ProductDetails = lazy(() => import("../sections/Client/ProductDetails"));

function Router() {
  let routes = useRoutes([
    {
      element: (
        <Suspense fallback={<PageLoading />}>
          <Navbar />
        </Suspense>
      ),
      children: [
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          ),
          path: "/",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <CategoryDetails />
            </Suspense>
          ),
          path: "/category/:id",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <ProductDetails />
            </Suspense>
          ),
          path: "/product/:id",
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<PageLoading />}>
          <Login />
        </Suspense>
      ),
      path: "/admin",
    },
    {
      element: (
        <Suspense fallback={<PageLoading />}>
          <SideBarNavbar />
        </Suspense>
      ),
      children: [
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Banners />
            </Suspense>
          ),
          path: "/admin/banners",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Brands />
            </Suspense>
          ),
          path: "/admin/brands",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Categories />
            </Suspense>
          ),
          path: "/admin/categories",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Clients />
            </Suspense>
          ),
          path: "/admin/clients",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Products />
            </Suspense>
          ),
          path: "/admin/products",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Subcategories />
            </Suspense>
          ),
          path: "/admin/subcategories",
        },
        {
          element: (
            <Suspense fallback={<Loading />}>
              <Users />
            </Suspense>
          ),
          path: "/admin/users",
        },
      ],
    },
    {
      element: <Navigate to="/" />,
      path: "*",
    },
  ]);
  return routes;
}

export default Router;
