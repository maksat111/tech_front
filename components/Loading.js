import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import './Loading.css';

function Loading({ size }) {
    return (
        <div className='loading_container'>
            <LoadingOutlined />
        </div>
    );
}

export default Loading;