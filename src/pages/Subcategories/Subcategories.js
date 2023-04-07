import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/TableComponent';
import { axiosInstance } from '../../config/axios';
import { Modal, message, Upload, Checkbox, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import './Subcategories.css';
import Input from 'antd/es/input/Input';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function Subcategories() {
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [total, setTotal] = useState(null);
    const [progress, setProgress] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectOptions, setSelectOptions] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [newItemCategory, setNewItemCategory] = useState([])
    const [newItem, setNewItem] = useState(null)

    useEffect(() => {
        axiosInstance.get('subcategories/list').then(async (res) => {
            let a = [];
            let b = [];
            setTotal(res.data.count);
            res.data?.results.forEach(element => {
                a.push({
                    id: element.id,
                    key: element.id,
                    name_ru: element.name_ru,
                    name_en: element.name_en,
                    name_tk: element.name_tk,
                    image: element.image,
                    category: element.category.name_ru
                })
            });
            setDataSource(a);
            const categories = await axiosInstance.get('categories/list/');
            categories.data?.forEach(item => {
                b.push({
                    label: item.name_ru,
                    value: item.name_ru,
                    id: item.id
                })
            });
            setSelectOptions(b);
        }).catch(err => console.log(err))
    }, [])

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: '65px',
        },
        {
            title: 'Название (рус.)',
            dataIndex: 'name_ru',
            key: 'name_ru',
        },
        {
            title: 'Название (туркм.)',
            dataIndex: 'name_tk',
            key: 'name_tk',
        },
        {
            title: 'Навзание (анг.)',
            dataIndex: 'name_en',
            key: 'name_en',
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Logo',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <img className='subcategory-image' src={record.image} alt={record.name_ru} />
            ),
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
            width: '120px',
            render: (_, record) => (
                <div className='update-icon' onClick={() => showAddModal(record)} >
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
            const newDataSource = dataSource.filter(element => element.id !== selectedItem.id);
            await axiosInstance.delete(`subcategoris/delete/${selectedItem.id}/`);
            setDataSource(newDataSource);
            message.success('Успешно удалено')
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
        if (item.id) {
            setSelectedItem(item);
            const filtered = selectOptions.filter(category => category.label == item.category);
            setNewItemCategory([{ id: filtered[0]?.id, label: item.category, value: item.category }])
            setNewItem(item);
        }
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        try {
            if (newItem.id) {
                const formData = new FormData();
                fileList[0] && formData.append("image", fileList[0].originFileObj, fileList[0].originFileObj.name);
                formData.append("name_ru", newItem.name_ru);
                formData.append("name_en", newItem.name_en);
                formData.append("name_tk", newItem.name_tk);
                formData.append('category', newItemCategory[0].id);
                const res = await axiosInstance.patch(`subcategoris/update/${newItem.id}/`, formData);
                const index = dataSource.findIndex(item => item.id == newItem.id);
                setDataSource(previousState => {
                    const a = previousState;
                    a[index].name_ru = newItem.name_ru;
                    a[index].name_en = newItem.name_en;
                    a[index].name_tk = newItem.name_tk;
                    a[index].image = fileList[0] ? URL.createObjectURL(fileList[0].originFileObj) : newItem.image;
                    a[index].category = newItemCategory[0].value;
                    return a;
                })
            } else {
                let a = [];
                setConfirmLoading(true);
                newItemCategory.forEach(async category => {
                    const formData = new FormData();
                    formData.append("image", fileList[0].originFileObj, fileList[0].originFileObj.name);
                    formData.append("name_ru", newItem.name_ru);
                    formData.append("name_en", newItem.name_en);
                    formData.append("name_tk", newItem.name_tk);
                    formData.append('category', category.id);
                    const res = await axiosInstance.post(`subcategories/add/`, formData);
                    a.push({
                        key: fileList[0].originFileObj.uid,
                        id: Math.floor(Math.random() * 1000),
                        image: URL.createObjectURL(fileList[0].originFileObj),
                        name_ru: newItem.name_ru,
                        name_en: newItem.name_en,
                        name_tk: newItem.name_tk,
                        category: category.name
                    })
                })
                setDataSource([...dataSource, ...a]);
            }
            setNewItemCategory([]);
            setNewItem(null);
            message.success('Успешно добавлено');
            setAddOpen(false);
            setFileList([]);
            setConfirmLoading(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleAddCancel = () => {
        setNewItemCategory([]);
        setFileList([]);
        setNewItem(null);
        setAddOpen(false);
    };

    const handleAddCustomRequest = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;

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
        try {
            onSuccess("Ok");
        } catch (err) {
            onError('Upload error');
        }
    };

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

    const handleAddChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
    }

    //-------------------------------------------------------pagination -----------------------------------------//
    const onPaginationChange = async (page) => {
        let a = [];
        const res = await axiosInstance.get(`subcategories/list?page=${page}`);
        res.data.results?.forEach(element => {
            a.push({
                id: element.id,
                key: element.id,
                name_ru: element.name_ru,
                name_en: element.name_en,
                name_tk: element.name_tk,
                image: element.image,
                category: element.category.name_ru
            })
        });
        setDataSource(a);
    }

    const handleUpdateSelectChange = (e) => {
        let a = [];
        selectOptions.forEach(item => {
            e.forEach(selected => item.value == selected && a.push({ id: item.id, label: selected, value: selected }));
        });
        setNewItemCategory(a);
    }

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
                style={{ top: '100px' }}
            >
                <div className='banner-add-container'>
                    <div className='add-left'>
                        <div className='add-column'>
                            Название (рус.):
                        </div>
                        <div className='add-column'>
                            Название (туркм.):
                        </div>
                        <div className='add-column'>
                            Навзание (анг.):
                        </div>
                        <div className='add-column'>
                            Категория:
                        </div>
                        <div className='add-picture'>
                            Logo
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-column'>
                            <Input name='name_ru' placeholder='Название (рус.)' value={newItem?.name_ru} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='name_tk' placeholder='Название (туркм.)' value={newItem?.name_tk} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='name_en' placeholder='Название (анг.)' value={newItem?.name_en} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Select
                                value={newItemCategory}
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Выберите категорию"
                                onChange={(e) => handleUpdateSelectChange(e)}
                                options={selectOptions}
                            />
                        </div>
                        <div className='add-picture'>
                            {newItem?.id && <img className='subcategory-image' src={newItem?.image} alt={newItem?.name_ru} />}
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
                    <h2>Подкатегории</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent
                    active={selectedItem?.id}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{ onChange: onPaginationChange, total: total, pageSize: 20 }} />
            </div>
        </>
    );
}

export default Subcategories;