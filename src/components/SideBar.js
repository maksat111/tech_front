import { React, useState } from 'react';
import { BsImages } from 'react-icons/bs';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { TbSubtask, TbMessageChatbot, TbUsers } from 'react-icons/tb';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';

function SideBar() {
    const [toggled, setToggled] = useState(false);
    const navigate = useNavigate();
    const iconStyle = toggled ? { fontSize: '22px', marginBottom: '-8px' } : { fontSize: '20px' };
    const items = [
        {
            icon: <TbMessageChatbot style={iconStyle} />,
            title: 'Новости',
            href: '/news'
        },
        {
            icon: <BsImages style={iconStyle} />,
            title: 'Баннеры',
            href: '/banners'
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