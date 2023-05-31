import { React, useState } from 'react';
import { BsImages } from 'react-icons/bs';
import { BiCategory } from 'react-icons/bi';
import { BsInboxes } from 'react-icons/bs';
import { RiAdminLine } from 'react-icons/ri';
import { AiOutlineExclamationCircle, AiOutlineTag } from 'react-icons/ai';
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
            icon: <BsImages style={iconStyle} />,
            title: 'Баннеры',
            href: '/admin/banners'
        },
        {
            icon: <BiCategory style={iconStyle} />,
            title: 'Категории',
            href: '/admin/categories'
        },
        {
            icon: <TbSubtask style={iconStyle} />,
            title: 'Подкатегории',
            href: '/admin/subcategories'
        },
        {
            icon: <AiOutlineTag style={iconStyle} />,
            title: 'Бренды',
            href: '/admin/brands'
        },
        {
            icon: <TbUsers style={iconStyle} />,
            title: 'Клиенты',
            href: '/admin/clients'
        },
        {
            icon: <RiAdminLine style={iconStyle} />,
            title: 'Пользователи',
            href: '/admin/users'
        },
        {
            icon: <BsInboxes style={iconStyle} />,
            title: 'Товары',
            href: '/admin/products'
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