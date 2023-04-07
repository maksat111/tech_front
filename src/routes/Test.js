import React, { useState } from 'react';
import { axiosInstance } from '../config/axios';

function Test(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleUploadChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile, selectedFile.name);
        console.log(formData);
        axiosInstance.post('banners/add/', formData).then(res => {
            console.log(res)
        })
    }

    return (
        <div>
            <input type='file' onChange={handleUploadChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default Test;