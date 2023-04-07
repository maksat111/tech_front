import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import logo from '../images/logo3.png';
import './Navbar.css';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/getToken';

function Navbar() {
    const [open, setOpen] = useState(false);
    const [profileName, setProfileName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('turkmenExpress-admin'));
        setProfileName(data.user_fio);
    }, [])

    const userStyle = { fontSize: '24px' };
    const logoutStyle = { transform: 'rotate(180deg)' };

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        localStorage.removeItem('turkmenExpress-admin');
        navigate('/');
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Modal
                title="Вы действительно хотите выйти?"
                open={open}
                onOk={handleOk}
                okText={'Да'}
                cancelText={'Нет'}
                okButtonProps={{ danger: true }}
                onCancel={handleCancel}
                style={{
                    top: '200px'
                }}
            />

            <div className='navbar-container'>
                <img src={logo} alt='turkmenExpress' />
                <div className='navbar-items'>
                    <div className='navbar-user-item'>
                        <AiOutlineUser style={userStyle} />
                        <p>{profileName}</p>
                    </div>
                    <div className='navbar-logout' onClick={showModal}>
                        <FiLogOut style={logoutStyle} />
                    Выйти
                </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;