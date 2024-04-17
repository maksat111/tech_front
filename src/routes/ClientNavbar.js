import { Outlet } from "react-router-dom";
import Navbar from "../sections/Client/components/Navbar";
import Footer from "../sections/Client/components/Footer";

const NavbarOutlet = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default NavbarOutlet;
