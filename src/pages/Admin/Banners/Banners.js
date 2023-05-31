import React, { useEffect, useState } from 'react';
import { Checkbox, message, Progress } from 'antd';
import TableComponent from '../../../components/Admin/TableComponent';
import { axiosInstance } from '../../../config/axios';
import { PlusOutlined } from '@ant-design/icons';
import './Banners.css';
import { Modal, Upload } from 'antd';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function Banners(props) {
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmUpdateLoading, setConfirmUpdateLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [progress, setProgress] = useState(0);
    const [newItemActive, setNewItemActive] = useState(true);
    const [openActive, setOpenActive] = useState(false);

    const handlePreviewCancel = () => setPreviewOpen(false);

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handlePreview = async (file) => {
        file.preview = await getBase64(file.originFileObj);
        setPreviewImage(file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name);
    };

    useEffect(() => {
        axiosInstance.get('admin/banner/list').then(res => {
            const a = [];
            res?.data.data.forEach(item => {
                a.push({
                    key: item._id,
                    _id: item._id,
                    image: 'http://127.0.0.1:5000/' + item.image,
                    is_active: item.is_active
                })
            });
            setDataSource(a);
        }).catch(err => console.log(err));
    }, []);

    const columns = [
        {
            title: 'Banner image',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <img className='banner-image' src={record.image} alt='banner' />
            ),
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (_, record) => (
                <Checkbox name='late' checked={record.is_active} onChange={() => showActiveModal(record)} />
            ),
        },
        {
            title: 'Delete',
            dataIndex: 'active',
            key: 'active',
            width: '110px',
            render: (_, record) => (
                <div className='delete-icon' onClick={() => showModal(record)}>
                    {/* <TiDelete /> */}
                    Удалить
                </div>
            ),
        },
        {
            title: 'Update',
            dataIndex: 'active',
            key: 'active',
            width: '120px',
            render: (_, record) => (
                <div className='update-icon' onClick={() => showUpdateModal(record)}>
                    {/* <TiDelete /> */}
                    Изменить
                </div>
            ),
        },
    ];

    const showModal = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            const res = await axiosInstance.delete(`admin/banner/delete/${selectedItem._id}`);
            const newDataSource = dataSource.filter(element => element._id !== selectedItem._id);
            setDataSource(newDataSource);
            message.success('Успешно удалено!')
            setOpen(false);
            setConfirmLoading(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    // ------------------------------ Change Active-------------------------------//
    const showActiveModal = (item) => {
        setSelectedItem(item);
        setOpenActive(true);
    };

    const handleActiveOk = async () => {
        try {
            setConfirmLoading(true);
            const res = await axiosInstance.patch(`admin/banner/update/${selectedItem._id}`, { is_active: !selectedItem.is_active });
            setDataSource(previousState => {
                let a = previousState;
                const index = a.findIndex(element => element._id === selectedItem._id);
                a[index].is_active = !a[index].is_active
                return a
            });
            message.success('Успешно изменено')
            setOpenActive(false);
            setConfirmLoading(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleActiveCancel = () => {
        setOpenActive(false);
    };

    //-----------------------------------------Add Modal-------------------------------------------------//
    const showAddModal = (item) => {
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        try {
            setConfirmLoading(true);
            const formData = new FormData();
            formData.append("image", fileList[0].originFileObj, fileList[0].originFileObj.name);
            formData.append("is_active", newItemActive);
            const res = await axiosInstance.post(`admin/banner/create`, formData);
            let a = {
                key: fileList[0].originFileObj.uid,
                _id: res.data._id,
                image: URL.createObjectURL(fileList[0].originFileObj),
                is_active: newItemActive
            }
            setDataSource([...dataSource, a]);
            message.success('Успешно добавлено!');
            setAddOpen(false);
            setFileList([]);
            setNewItemActive(true);
            setConfirmLoading(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleAddCancel = () => {
        setFileList([]);
        setAddOpen(false);
    };

    const handleAddCustomRequest = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const config = {
            onUploadProgress: event => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                setProgress(percent);
                if (percent === 100) {
                    setTimeout(() => setProgress(0), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
            }
        };
        try {
            onSuccess("Ok");
        } catch (err) {
            onError('Upload error');
        }
    };

    //--------------------------------------Update Modal ------------------------------------//
    const showUpdateModal = (item) => {
        setSelectedItem(item);
        setOpenUpdate(true);
    };

    const handleUpdateOk = async () => {
        try {
            await axiosInstance.patch(`admin/banner/update/${selectedItem._id}`)
            setDataSource(previousState => {
                const a = previousState;
                const index = a.findIndex(element => element._id === selectedItem._id);
                a[index].image = URL.createObjectURL(fileList[0].originFileObj);
                return a;
            })
            setFileList([]);
            message.success('Успешно изменено!');
            setOpenUpdate(false);
        } catch (err) {
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!');
            setOpenUpdate(false);
            console.log(err)
        }
    }

    const handleCustomRequest = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const config = {
            onUploadProgress: event => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                setProgress(percent);
                if (percent === 100) {
                    setTimeout(() => setProgress(0), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
            }
        };
        try {
            onSuccess("Ok");
        } catch (err) {
            onError({ err });
        }
    };


    const handleUpdateCancel = () => {
        setFileList([])
        setOpenUpdate(false);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
          </div>
        </div>
    );

    return (
        <>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel} centered zIndex={'1001'}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
            <Modal
                title="Выберите баннер и активность для добавления"
                open={addOpen}
                onOk={handleAddOk}
                width={'600px'}
                confirmLoading={confirmLoading}
                onCancel={handleAddCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                okType={'primary'}
                style={{ top: '200px' }}
            >
                <div className='banner-add-container'>
                    <div className='add-left'>
                        <div className='add-picture'>
                            Выберите баннер
                        </div>
                        <div className='add-column'>
                            Активный
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-picture'>
                            <Upload
                                customRequest={handleAddCustomRequest}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {fileList.length == 0 && uploadButton}
                            </Upload>
                        </div>
                        <div className='add-column'>
                            <Checkbox checked={newItemActive} onChange={(e) => setNewItemActive(e.target.checked)} />
                        </div>
                    </div>
                </div>

            </Modal>
            <Modal
                title="Вы уверены, что хотите удалить?"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okButtonProps={{ danger: true }}
                cancelText={'Отмена'}
                okText={'Да'}
                okType={'primary'}
                style={{
                    top: '200px'
                }}
            />
            <Modal
                title="Вы уверены, что хотите изменить активност?"
                open={openActive}
                onOk={handleActiveOk}
                confirmLoading={confirmLoading}
                onCancel={handleActiveCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                okType={'primary'}
                style={{
                    top: '200px'
                }}
            />
            <Modal
                title="Изменить"
                width='750px'
                open={openUpdate}
                onOk={handleUpdateOk}
                confirmLoading={confirmUpdateLoading}
                onCancel={handleUpdateCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                okType={'primary'}
                style={{
                    top: '200px'
                }}
            >
                <div className='banner-update-container'>
                    <div className='banner-update-left'>
                        <p className='banner-image-content'>Image</p>
                        {/* <p>New Image</p> */}
                    </div>
                    <div className='banner-update-right'>
                        <img className='banner-image' src={selectedItem?.image} />
                        <Upload
                            customRequest={handleCustomRequest}
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length == 0 && uploadButton}
                        </Upload>
                    </div>
                </div>
            </Modal>
            <div className='banners-container page'>
                <div className='banners-header-container'>
                    <h2>Баннеры</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent dataSource={dataSource} columns={columns} pagination={false} active={selectedItem?._id} />
            </div>
        </>
    );
}

export default Banners;