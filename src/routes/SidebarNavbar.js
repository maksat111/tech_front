import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Admin/Navbar';
import SideBar from '../components/Admin/SideBar';
import './SidebarNavbar.css';

function SidebarNavbar() {
    return (
        <div className='sidebar-navbar-container'>
            <Navbar />
            <div className='sidebar-outlet'>
                <SideBar />
                <Outlet />
            </div>
        </div>
    );
}

export default SidebarNavbar;