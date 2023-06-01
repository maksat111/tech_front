import React, { useEffect, useState } from 'react';
import TableComponent from '../../../components/Admin/TableComponent';
import { axiosInstance } from '../../../config/axios';
import { Modal, message, Upload, Checkbox, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import './Brands.css';
import Input from 'antd/es/input/Input';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function Brands() {
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [progress, setProgress] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [selectOptions, setSelectOptions] = useState(null);
    const [total, setTotal] = useState(null);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [ordering, setOrdering] = useState({});


    useEffect(() => {
        axiosInstance.get('admin/brand/list').then(async (res) => {
            let a = [];
            let b = [];
            setTotal(res.data.count)
            res.data.data?.forEach(item => {
                a.push({
                    key: item._id,
                    _id: item._id,
                    name: item.name,
                    image: item.image,
                })
            });
            setDataSource(a);
        }).catch(err => console.log(err))
    }, [])

    const columns = [
        {
            title: 'Логотип',
            dataIndex: 'logo',
            key: 'logo',
            render: (_, record) => (
                <img className='brand-image' src={'http://127.0.0.1:5000/' + record.image} alt={record.name} />
            ),
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: '300px',
            sorter: true,
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Удалить',
            dataIndex: 'active',
            key: 'active',
            width: '110px',
            render: (_, record) => (
                <div className='delete-icon' onClick={() => showModal(record)}>
                    Удалить
                </div>
            ),
        },
        {
            title: 'Изменить',
            dataIndex: 'active',
            key: 'active',
            width: '125px',
            render: (_, record) => (
                <div className='update-icon' onClick={() => showUpdateModal(record)} >
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
            await axiosInstance.delete(`admin/brand/delete/${selectedItem._id}`);
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

    //-----------------------------------------Add Modal-------------------------------------------------//
    const showAddModal = (item) => {
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        try {
            setConfirmLoading(true);
            let a = [];
            if (newItemCategory.length > 0) {
                newItemCategory.forEach(async category => {
                    const formData = new FormData();
                    formData.append("image", fileList[0].originFileObj, fileList[0].originFileObj.name);
                    formData.append("name", newItemName);
                    const res = await axiosInstance.post(`admin/brand/create`, formData);
                    a.push({
                        key: res.data.data._id,
                        _id: res.data.data._id,
                        image: res.data.data.image,
                        name: newItemName,
                    })
                })
            } else {
                const formData = new FormData();
                fileList[0] && formData.append("image", fileList[0].originFileObj, fileList[0].originFileObj.name);
                formData.append("name", newItemName);
                const res = await axiosInstance.post(`admin/brand/create`, formData);
                a.push({
                    key: res.data.data._id,
                    _id: res.data.data._id,
                    image: res.data.data.image,
                    name: newItemName,
                })
            }
            setNewItemCategory([]);
            setNewItemName('');
            setDataSource([...dataSource, ...a]);
            message.success('Успешно добавлено!');
            setAddOpen(false);
            setFileList([]);
            // setNewItemActive(true);
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
        const fmData = new FormData();

        const config = {
            headers: { "content-type": "multipart/form-data" },
            onUploadProgress: event => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                setProgress(percent);
                if (percent === 100) {
                    setTimeout(() => setProgress(0), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
            }
        };
        fmData.append("image", file);
        try {
            onSuccess("Ok");
        } catch (err) {
            onError('Upload error');
        }
    };

    //------------------------------------------------update modal--------------------------------------------//
    const showUpdateModal = (item) => {
        setSelectedItem(item);
        setNewItemName(item.name)
        setUpdateOpen(true);
    };

    const handleUpdateOk = async () => {
        try {
            setConfirmLoading(true);
            const formData = new FormData();
            fileList[0] && formData.append("image", fileList[0].originFileObj, fileList[0].originFileObj.name);
            formData.append("name", newItemName);
            const res = await axiosInstance.patch(`admin/brand/update/${selectedItem._id}`, formData);
            setDataSource(previousState => {
                const a = previousState;
                const index = a.findIndex(element => element._id === selectedItem._id);
                if (fileList[0]) a[index].image = URL.createObjectURL(fileList[0].originFileObj);
                a[index].name = newItemName;
                if (newItemCategory[0]) a[index].category = newItemCategory[0].value;
                return a;
            })
            setFileList([]);
            setNewItemCategory([]);
            setNewItemName('');
            setConfirmLoading(false);
            message.success('Успешно изменено!');
            setUpdateOpen(false);
        } catch (err) {
            setConfirmLoading(false);
            message.error(err.message)
        }
    }

    const handleUpdateCancel = () => {
        setNewItemCategory([]);
        setNewItemName('');
        setUpdateOpen(false);
    };

    const handleUpdateSelectChange = (e) => {
        let a = [];
        selectOptions.forEach(item => {
            e.forEach(selected => item.value == selected && a.push({ _id: item._id, label: selected, value: selected }));
        });
        setNewItemCategory(a);
    }

    //-----------------------------------------upload--------------------------------------------//
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handlePreviewCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        file.preview = await getBase64(file.originFileObj);
        setPreviewImage(file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name);
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

    //----------------------------------------------------------select -----------------------------------------//

    const handleSelectChange = (e) => {
        let a = [];
        selectOptions.forEach(item => {
            e.forEach(selected => item.value == selected && a.push({ _id: item._id, label: selected, value: selected }));
        });
        setNewItemCategory(a);
    }

    //-------------------------------------------------------pagination -----------------------------------------//
    const onPaginationChange = async (page) => {
        let a = [];
        const res = await axiosInstance.get(`admin/brand/list?page=${page}`);
        res.data.results?.forEach(item => {
            a.push({
                key: item._id,
                _id: item._id,
                name: item.name,
                image: item.image,
            });
        });
        setDataSource(a);
    }

    //-------------------------------------------------------filter -----------------------------------------//
    const handleFilterChange = async (e) => {
        try {

        } catch (err) {
            console.log(err);
        }
    }

    const handleTableChange = async (a, b, c) => {
        const data = [];
        if (c.field !== ordering?.field || c.order !== ordering?.order) {
            setOrdering(previousState => {
                let a = previousState;
                a.field = c.field;
                a.order = c.order;
                return a;
            });
            if (c.order == 'ascend') {
                var query = `admin/brand/list?ordering=${c.field}`;
            } else {
                var query = `admin/brand/list?ordering=-${c.field}`;
            }
            axiosInstance.get(query).then(res => {
                res.data.data?.forEach(item => {
                    data.push({
                        key: item._id,
                        _id: item._id,
                        name: item.name,
                        image: item.image,
                    })
                });

                setDataSource(data);
            }).catch(err => console.log(err));
        }
    }

    useEffect(() => {
        axiosInstance.get(`admin/brand/list?search=${searchValue}`).then(res => {
            let a = [];
            setTotal(res.data.count)
            res.data.data?.forEach(item => {
                a.push({
                    key: item._id,
                    _id: item._id,
                    name: item.name,
                    image: item.image,
                })
            });
            setDataSource(a);
        })
    }, [searchValue])

    return (
        <>
            <Modal
                title="Дополните детали для добавления"
                open={addOpen}
                onOk={handleAddOk}
                confirmLoading={confirmLoading}
                onCancel={handleAddCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                width={'600px'}
                okType={'primary'}
                style={{ top: '200px' }}
            >
                <div className='banner-add-container'>
                    <div className='add-left'>
                        <div className='add-column'>
                            Название
                        </div>
                        <div className='add-picture'>
                            Logo
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-column'>
                            <Input value={newItemName} allowClear size={'medium'} placeholder={'Название...'} onChange={(e) => setNewItemName(e.target.value)} />
                        </div>
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
                    </div>
                </div>
            </Modal>
            <Modal
                title="Дополните детали для обнавления"
                open={updateOpen}
                onOk={handleUpdateOk}
                confirmLoading={confirmLoading}
                onCancel={handleUpdateCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                width={'700px'}
                okType={'primary'}
                style={{ top: '200px' }}
            >
                <div className='banner-add-container'>
                    <div className='add-left'>
                        <div className='add-column'>
                            Название
                        </div>
                        <div className='add-picture'>
                            Logo
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-column'>
                            <Input value={newItemName} allowClear size={'medium'} placeholder={'Название...'} onChange={(e) => setNewItemName(e.target.value)} />
                        </div>
                        <div className='add-picture'>
                            <img className='brand-image' src={'http://127.0.0.1:5000/' + selectedItem?.image} alt='selected' />
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
            <div className='page'>
                <div className='page-header-content'>
                    {/* <h2>{`Бренды (${total})`}</h2> */}
                    <h2>{`Бренды`}</h2>
                    <div className='add-button' onClick={showAddModal}>Добавить</div>
                </div>
                <div className='brands-header-filters'>
                    <Input placeholder='Search' size='middle' value={searchValue} allowClear onChange={(e) => setSearchValue(e.target.value)} />
                </div>
                <TableComponent
                    onChange={handleTableChange}
                    rowClassName={(record, rowIndex) => rowIndex == 2 && 'salam'}
                    active={selectedItem?._id}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{ onChange: onPaginationChange, total: total, pageSize: 20, position: ['topRight', 'bottomRight'] }}
                />
            </div>
        </>
    );
}

export default Brands;