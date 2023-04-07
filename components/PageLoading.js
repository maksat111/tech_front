import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import Logo from '../images/logo.png';
import { isLogin } from '../utils/isLogin';
import './PageLoading.css';

function PageLoading() {
    const location = useLocation();
    if (!isLogin() && window.location.pathname !== '/') {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    return (
        <div className='pageLoading-container'>
            <img src={Logo} alt='Turkmen Express' />
            <BeatLoader
                color={'red'}
                loading={true}
                width={'400px'}
            />
        </div>
    );
}

export default PageLoading;