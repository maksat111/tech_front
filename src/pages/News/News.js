import React, { useEffect, useState } from 'react';
import { message, Input, Select } from 'antd';
import TableComponent from '../../components/TableComponent';
import { axiosInstance } from '../../config/axios';
import { PlusOutlined } from '@ant-design/icons';
import './News.css';
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
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [progress, setProgress] = useState(0);
    const [newItem, setNewItem] = useState(null);
    const [selected, setSelected] = useState(null);
    const [options, setOptions] = useState(null);
    const [total, setTotal] = useState(null);

    const handlePreviewCancel = () => setPreviewOpen(false);

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handlePreview = async (file) => {
        file.preview = await getBase64(file.originFileObj);
        setPreviewImage(file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name);
    };

    useEffect(() => {
        axiosInstance.get('news/list').then(async res => {
            setTotal(res.data.count)
            res?.data.data.forEach(item => {
                item.key = item._id;
                item.image = 'http://127.0.0.1:5000/' + item.image;
                item.section = item.section == null ? '-' : item.section.name_ru;
                item.phone_number = item.phone_number == null ? '-' : item.phone_number;
                item.author = item.author == null ? '-' : item.author;
            });
            setDataSource(res.data.data);

            const options = await axiosInstance.get('section/list');
            const a = [];
            options.data.data.forEach(item => {
                a.push({
                    label: item.name_ru,
                    value: item.name_ru,
                    _id: item._id,
                });
            })
            setOptions(a);
        }).catch(err => console.log(err));
    }, []);

    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <img className='news-image' src={record.image} alt='Image' />
            ),
        },
        {
            title: 'Раздел',
            dataIndex: 'section',
            key: 'section',
        },
        {
            title: 'Заголовок (рус.)',
            dataIndex: 'title_ru',
            key: 'title_ru',
        },
        {
            title: 'Заголовок (туркм.)',
            dataIndex: 'title_tm',
            key: 'title_tm',
        },
        {
            title: 'Содержание (рус.)',
            dataIndex: 'content_ru',
            key: 'content_ru',
        },
        {
            title: 'Содержание (туркм.)',
            dataIndex: 'content_tm',
            key: 'content_tm',
        },
        {
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phone_number',
            key: 'phone_number',
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
                <div className='update-icon' onClick={() => showAddModal(record)}>
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
            const res = await axiosInstance.post(`news/delete/${selectedItem._id}`);
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
        if (item._id) {
            setNewItem(item);
            setSelectedItem(item);
            const filtered = options.filter(element => element.value == item.section);
            setSelected(filtered[0]);
        };
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        try {
            setConfirmLoading(true);
            delete newItem.section;
            delete newItem.image;
            const formData = new FormData();
            const keys = Object.keys(newItem);
            const values = Object.values(newItem);
            keys.forEach((key, index) => {
                formData.append(key, values[index]);
            })
            fileList[0] && formData.append("image", fileList[0].originFileObj, fileList[0].originFileObj.name);
            formData.append("section", selected._id);
            if (selectedItem?._id) {
                const res = await axiosInstance.patch(`news/update/${selectedItem._id}`, formData);
                setDataSource(previousState => {
                    const a = previousState;
                    const index = a.findIndex(item => item._id == newItem._id);
                    keys.forEach((item, i) => {
                        a[index][item] = values[i];
                    });
                    a[index].section = selected.label;
                    if (fileList[0]) a[index].image = URL.createObjectURL(fileList[0].originFileObj);
                    return a;
                })
            }
            if (!selectedItem) {
                const res = await axiosInstance.post(`news/create`, formData);
                res.data.data._id = res.data.data._id;
                res.data.data.key = fileList[0].originFileObj.uid;
                res.data.data.image = URL.createObjectURL(fileList[0].originFileObj);
                res.data.data.section = selected.label;
                res.data.data.phone_number = res.data.data.phone_number == null ? '-' : res.data.data.phone_number;
                res.data.data.author = res.data.data.author == null ? '-' : res.data.data.author;
                setDataSource([...dataSource, res.data.data]);
            }
            message.success('Успешно добавлено');
            setAddOpen(false);
            setSelected(null);
            setFileList([]);
            setNewItem(null);
            setConfirmLoading(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleAddCancel = () => {
        setFileList([]);
        setSelected(null);
        setNewItem(null);
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

    const handleAddChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
    }

    const handleSelect = (e) => {
        const filtered = options.filter(item => item.value == e);
        setSelected(filtered[0]);
    }

    const onPaginationChange = async (page) => {
        const res = await axiosInstance.get(`news/list?page=${page}`);
        res.data.data?.forEach(item => {
            item.key = item._id;
            item.image = 'http://216.250.10.118:5000/' + item.image;
            item.section = item.section == null ? '-' : item.section.name_ru;
            item.phone_number = item.phone_number == null ? '-' : item.phone_number;
            item.author = item.author == null ? '-' : item.author;
        });
        setDataSource(res.data.data);
    }

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
                title="Дополните детали"
                open={addOpen}
                onOk={handleAddOk}
                width={'600px'}
                confirmLoading={confirmLoading}
                onCancel={handleAddCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                okType={'primary'}
                style={{ top: '50px' }}
            >
                <div className='banner-add-container'>
                    <div className='add-left'>
                        <div className='add-picture'>
                            Изображение
                        </div>
                        <div className='add-column'>
                            Раздел
                        </div>
                        <div className='add-column'>
                            Заголовок (рус.)
                        </div>
                        <div className='add-column'>
                            Заголовок (туркм.)
                        </div>
                        <div className='add-column-textarea'>
                            Содержание (рус.)
                        </div>
                        <div className='add-column-textarea'>
                            Содержание (туркм.)
                        </div>
                        <div className='add-column'>
                            Автор
                        </div>
                        <div className='add-column'>
                            Номер телефона
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-picture'>
                            {newItem?._id && <img className='brand-image' src={newItem.image} alt={newItem?.name_ru} />}
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
                            <Select
                                value={selected}
                                showSearch
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Выберите категорию"
                                onChange={(e) => handleSelect(e)}
                                options={options}
                            />
                        </div>
                        <div className='add-column'>
                            <Input name='title_ru' placeholder='Заголовок (рус.)' value={newItem?.title_ru} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='title_tm' placeholder='Заголовок (туркм.)' value={newItem?.title_tm} onChange={handleAddChange} />
                        </div>
                        <div className='add-column-textarea'>
                            <Input.TextArea name='content_ru' placeholder='Содержание (рус.)' value={newItem?.content_ru} onChange={handleAddChange} />
                        </div>
                        <div className='add-column-textarea'>
                            <Input.TextArea name='content_tm' placeholder='Содержание (туркм.)' value={newItem?.content_tm} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='author' placeholder='Автор' value={newItem?.author} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='phone_number' placeholder='Номер телефона' value={newItem?.phone_number} onChange={handleAddChange} />
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
            <div className='banners-container page'>
                <div className='banners-header-container'>
                    <h2>{`Новости (${total})`}</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ onChange: onPaginationChange, total: total, pageSize: 10, position: ['bottomRight'] }}
                    active={selectedItem?._id} />
            </div>
        </>
    );
}

export default Banners;