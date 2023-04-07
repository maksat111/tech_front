import { React, useState } from 'react';
import { TfiDashboard } from 'react-icons/tfi';
import { BsImages, BsInboxes } from 'react-icons/bs';
import { AiOutlineTag, AiOutlineShoppingCart } from 'react-icons/ai';
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
        {
            group: 'БИБЛИОНТЕКА',
            icon: <TfiDashboard style={iconStyle} />,
            title: 'Dashboard',
            href: '/dashboard'
        },
        {
            icon: <BsImages style={iconStyle} />,
            title: 'Баннеры',
            href: '/banners'
        },
        {
            icon: <AiOutlineTag style={iconStyle} />,
            title: 'Бренды',
            href: '/brands'
        },
        {
            icon: <TbTruckDelivery style={iconStyle} />,
            title: 'Виды доставок',
            href: '/deliveryType'
        },
        {
            icon: <RiCoupon2Line style={iconStyle} />,
            title: 'Виды купонов',
            href: '/couponType'
        },
        {
            icon: <MdMapsHomeWork style={iconStyle} />,
            title: 'Города и этрапы',
            href: '/city'
        },
        {
            icon: <BiCategory style={iconStyle} />,
            title: 'Категории',
            href: '/categories'
        },
        {
            icon: <TbSubtask style={iconStyle} />,
            title: 'Подкатегории',
            href: '/subcategories'
        },
        {
            icon: <FaCity style={iconStyle} />,
            title: 'Регионы',
            href: '/regions'
        },
        {
            icon: <TbMessageChatbot style={iconStyle} />,
            title: 'СМС таблица',
            href: '/smsTable'
        },
        {
            group: 'КЛИЕНТЫ',
            icon: <TbUsers style={iconStyle} />,
            title: 'Клиенты',
            href: '/clients'
        },
        {
            icon: <AiOutlineShoppingCart style={iconStyle} />,
            title: 'Типы покупателей',
            href: '/clientType'
        },
        {
            group: 'ТОВАРЫ',
            icon: <TbDiscount2 style={toggled ? { fontSize: '26px', marginBottom: '-5px' } : { fontSize: '23px', marginLeft: '-2px' }} />,
            title: 'Виды скидок',
            href: '/discountList'
        },
        {
            icon: <FiSettings style={iconStyle} />,
            title: 'Группа опций',
            href: '/groupSettings'
        },
        {
            icon: <RiListSettingsLine style={toggled ? { fontSize: '25px', marginBottom: "-8px" } : { fontSize: '24px' }} />,
            title: toggled ? 'Груп. опц. в подактегориях' : 'Группа опций в подактегориях',
            href: '/subcategorySettings'
        },
        {
            icon: <VscSettings style={iconStyle} />,
            title: 'Список опций',
            href: '/settingsList'
        },
        {
            icon: <BsInboxes style={iconStyle} />,
            title: 'Товары',
            href: '/products'
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