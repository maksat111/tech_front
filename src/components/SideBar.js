import { React, useState } from 'react';
import { TfiDashboard } from 'react-icons/tfi';
import { BsImages, BsInboxes } from 'react-icons/bs';
import { AiOutlineTag, AiOutlineShoppingCart, AiOutlineExclamationCircle } from 'react-icons/ai';
import { TbTruckDelivery, TbSubtask, TbMessageChatbot, TbUsers, TbDiscount2 } from 'react-icons/tb';
import { RiCoupon2Line, RiListSettingsLine } from 'react-icons/ri';
import { FaCity } from 'react-icons/fa';
import { MdMapsHomeWork } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FiSettings } from 'react-icons/fi';
import { VscSettings } from 'react-icons/vsc';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';

function SideBar() {
    const [toggled, setToggled] = useState(false);
    const navigate = useNavigate();
    const iconStyle = toggled ? { fontSize: '22px', marginBottom: '-8px' } : { fontSize: '20px' };
    const items = [
        // {
        //     group: 'БИБЛИОНТЕКА',
        //     icon: <TfiDashboard style={iconStyle} />,
        //     title: 'Dashboard',
        //     href: '/dashboard'
        // },
        // {
        //     icon: <BsImages style={iconStyle} />,
        //     title: 'Баннеры',
        //     href: '/banners'
        // },
        {
            icon: <TbMessageChatbot style={iconStyle} />,
            title: 'Новости',
            href: '/news'
        },
        {
            icon: <TbSubtask style={iconStyle} />,
            title: 'Разделы',
            href: '/sections'
        },
        {
            icon: <TbUsers style={iconStyle} />,
            title: 'Пользователи',
            href: '/users'
        },
        {
            icon: <AiOutlineExclamationCircle style={iconStyle} />,
            title: 'О нас',
            href: '/aboutUs'
        },
    ]

    const handleSidebarClick = (href) => {
        navigate(href);
    }

    const hanldeToggle = () => {
        setToggled(!toggled);
    }

    return (
        <div className={`${toggled ? 'toggled-sidebar-container' : 'sidebar_container'}`}>
            {items.map((item, index) => <div className='sidebar-items' key={index}>
                {item.group && <p className={`${toggled ? 'sidebar-toggled-group' : 'sidebar-group'}`}>{item.group}</p>}
                <div
                    className={`${toggled ? 'toggled-sidebar-item' : 'sidebar-item'} ${window.location.pathname === item.href ? 'active-sidebar' : ''}`}
                    onClick={() => handleSidebarClick(item.href)}
                >
                    {item.icon}
                    <p>{item.title}</p>
                </div>
            </div>)}
            <div className={`${toggled ? 'toggled-sidebar-button' : 'sidebar-toggle-button'}`} onClick={hanldeToggle}>
                {toggled ? <HiOutlineChevronDoubleRight /> : <HiOutlineChevronDoubleLeft />}
            </div>
        </div>
    );
}

export default SideBar;