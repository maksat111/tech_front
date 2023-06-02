import React, { useEffect, useState } from 'react';
import TableComponent from '../../../components/Admin/TableComponent';
import { axiosInstance } from '../../../config/axios';
import { Modal, message, Upload, Checkbox, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import './Products.css';
import '../Subcategories/Subcategories.css';
import Input from 'antd/es/input/Input';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function Products() {
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
    const [subcategoryOptions, setSubcategoryOptions] = useState(null);
    const [brandOptions, setBrandOptions] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [newItemCategory, setNewItemCategory] = useState([]);
    const [newItemSubCategory, setNewItemSubCategory] = useState([]);
    const [newItemBrand, setNewItemBrand] = useState([]);
    const [newItem, setNewItem] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [ordering, setOrdering] = useState({})

    useEffect(() => {
        axiosInstance.get('admin/product/list').then(async (res) => {
            let a = [];
            let b = [];
            let c = [];
            let d = [];
            setTotal(res.data.count);
            console.log(res.data.data)
            console.log(res.data.data)
            res.data?.data.forEach(element => {
                a.push({
                    key: element._id,
                    _id: element._id,
                    main_image: element.main_image,
                    name_ru: element.name_ru,
                    name_en: element.name_en,
                    name_tm: element.name_tm,
                    description_tm: element.description_tm,
                    description_ru: element.description_ru,
                    description_en: element.description_en,
                    category: element.category.name_ru,
                    subcategory: element.subcategory.name_ru,
                    brand: element.brand.name,
                })
            });
            setDataSource(a);
            const categories = await axiosInstance.get('admin/category/list');
            categories.data.data?.forEach(item => {
                b.push({
                    label: item.name_ru,
                    value: item.name_ru,
                    _id: item._id
                })
            });

            setSelectOptions(b);

            const subcategories = await axiosInstance.get('admin/subcategory/list');
            subcategories.data.data?.forEach(item => {
                c.push({
                    label: item.name_ru,
                    value: item.name_ru,
                    _id: item._id
                })
            });
            setSubcategoryOptions(c)

            const brands = await axiosInstance.get('admin/brand/list');
            brands.data.data?.forEach(item => {
                d.push({
                    label: item.name,
                    value: item.name,
                    _id: item._id
                })
            });
            setBrandOptions(d)
        }).catch(err => console.log(err))
    }, [])

    const columns = [
        {
            title: 'Главная картинка',
            dataIndex: 'main_image',
            key: 'main_image',
            render: (_, record) => (
                <img className='subcategory-image' src={'http://127.0.0.1:5000/' + record.main_image} alt={record.name_ru} />
            ),
        },
        {
            title: 'Название (рус.)',
            dataIndex: 'name_ru',
            key: 'name_ru',
            sorter: true,
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Подкатегория',
            dataIndex: 'subcategory',
            key: 'subcategory',
            sorter: true,
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Бренд',
            dataIndex: 'brand',
            key: 'brand',
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
            const newDataSource = dataSource.filter(element => element._id !== selectedItem._id);
            await axiosInstance.delete(`admin/product/delete/${selectedItem._id}/`);
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
            setSelectedItem(item);
            setNewItemCategory({ _id: item.category._id, label: item.category.name_ru, value: item.category.name_ru });
            setNewItemSubCategory({ _id: item.category._id, label: item.category.name_ru, value: item.category.name_ru });
            setNewItemBrand({ _id: item.category._id, label: item.category.name_ru, value: item.category.name_ru });
            setNewItem(item);
        }
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        try {
            setConfirmLoading(true);
            const formData = new FormData();
            fileList[0] && formData.append("main_image", fileList[0].originFileObj, fileList[0].originFileObj.name);
            formData.append("name_ru", newItem.name_ru);
            formData.append("name_en", newItem.name_en);
            formData.append("name_tm", newItem.name_tm);
            formData.append("description_ru", newItem.description_ru);
            formData.append("description_en", newItem.description_en);
            formData.append("description_tm", newItem.description_tm);
            formData.append('category', newItemCategory._id);
            formData.append('subcategory', newItemSubCategory._id);
            formData.append('brand', newItemBrand._id);
            if (newItem._id) {
                const res = await axiosInstance.patch(`admin/product/update/${newItem._id}`, formData);
                const index = dataSource.findIndex(item => item._id == newItem._id);
                setDataSource(previousState => {
                    const a = previousState;
                    a[index].name_ru = newItem.name_ru;
                    a[index].name_en = newItem.name_en;
                    a[index].name_tm = newItem.name_tm;
                    a[index].description_ru = newItem.description_ru;
                    a[index].description_en = newItem.description_en;
                    a[index].description_tm = newItem.description_tm;
                    a[index].main_image = res.data.data.main_image;
                    a[index].category = newItemCategory.value;
                    a[index].subcategory = newItemSubCategory.value;
                    a[index].brand = newItemBrand.value;
                    return a;
                })
            } else {
                const res = await axiosInstance.post(`admin/product/create`, formData);
                const a = {
                    key: res.data.data._id,
                    _id: res.data.data._id,
                    main_image: res.data.data.main_image,
                    name_ru: newItem.name_ru,
                    name_en: newItem.name_en,
                    name_tm: newItem.name_tm,
                    description_tm: newItem.description_tm,
                    description_ru: newItem.description_ru,
                    description_en: newItem.description_en,
                    category: newItemCategory.value,
                    subcategory: newItemSubCategory.value,
                    brand: newItemBrand.value,
                }

                setDataSource([...dataSource, a]);
            }
            setNewItemCategory([]);
            setNewItemSubCategory([]);
            setNewItemBrand([]);
            setFileList([]);
            setNewItem(null);
            message.success('Успешно добавлено!');
            setAddOpen(false);
            setConfirmLoading(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
        }
    };

    const handleAddCancel = () => {
        setNewItemCategory([]);
        setNewItemSubCategory([]);
        setNewItemBrand([]);
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
        const res = await axiosInstance.get(`admin/product/list?page=${page}`);
        res.data.data?.forEach(element => {
            a.push({
                key: element._id,
                _id: element._id,
                main_image: element.main_image,
                name_ru: element.name_ru,
                name_en: element.name_en,
                name_tm: element.name_tm,
                description_tm: element.description_tm,
                description_ru: element.description_ru,
                description_en: element.description_en,
                category: element.category.name_ru,
                subcategory: element.subcategory.name_ru,
                brand: element.brand.name,
            })
        });
        setDataSource(a);
    }

    const handleUpdateSelectChange = (e) => {
        const filtered = selectOptions.filter(item => item.value == e);
        setNewItemCategory(filtered[0]);
    }

    const handleSubcategoryChange = (e) => {
        const filtered = subcategoryOptions.filter(item => item.value == e);
        setNewItemSubCategory(filtered[0]);
    }

    const handleBrandChange = (e) => {
        const filtered = brandOptions.filter(item => item.value == e);
        setNewItemBrand(filtered[0]);
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
                var query = `admin/product/list?ordering=${c.field}`;
            } else {
                var query = `admin/product/list?ordering=-${c.field}`;
            }
            axiosInstance.get(query).then(res => {
                setTotal(res.data.count);
                res.data?.data.forEach(element => {
                    data.push({
                        key: element._id,
                        _id: element._id,
                        main_image: element.main_image,
                        name_ru: element.name_ru,
                        name_en: element.name_en,
                        name_tm: element.name_tm,
                        description_tm: element.description_tm,
                        description_ru: element.description_ru,
                        description_en: element.description_en,
                        category: element.category.name_ru,
                        subcategory: element.subcategory.name_ru,
                        brand: element.brand.name,
                    })
                });
                setDataSource(data);
            }).catch(err => console.log(err));
        }
    }

    useEffect(() => {
        axiosInstance.get(`admin/product/list?search=${searchValue}`).then(res => {
            res?.data.data.forEach(element => {
                element.key = element._id;
                element.category = element.category.name_ru;
                element.subcategory = element.subcategory.name_ru;
                element.brand = element.brand.name;
            });
            setDataSource(res.data.data);
        }).catch(err => console.log(err));
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
                width={'800px'}
                okType={'primary'}
                style={{ top: '20px', bottom: '0px' }}
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
                        <div className='add-column'>
                            Подкатегория:
                        </div>
                        <div className='add-column'>
                            Бренд:
                        </div>
                        <div className='add-picture'>
                            Главный изображения
                        </div>
                        <div className='add-textarea'>
                            Полное описание (рус.):
                        </div>
                        <div className='add-textarea'>
                            Полное описание (туркм.):
                        </div>
                        <div className='add-textarea'>
                            Полное описание (анг.):
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-column'>
                            <Input name='name_ru' placeholder='Название (рус.)' value={newItem?.name_ru} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='name_tm' placeholder='Название (туркм.)' value={newItem?.name_tm} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='name_en' placeholder='Название (анг.)' value={newItem?.name_en} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Select
                                value={newItemCategory}
                                showSearch
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Выберите категорию"
                                onChange={(e) => handleUpdateSelectChange(e)}
                                options={selectOptions}
                            />
                        </div>
                        <div className='add-column'>
                            <Select
                                value={newItemSubCategory}
                                showSearch
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Выберите подкатегорию"
                                onChange={(e) => handleSubcategoryChange(e)}
                                options={subcategoryOptions}
                            />
                        </div>
                        <div className='add-column'>
                            <Select
                                value={newItemBrand}
                                showSearch
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Выберите подкатегорию"
                                onChange={(e) => handleBrandChange(e)}
                                options={brandOptions}
                            />
                        </div>
                        <div className='add-picture'>
                            {newItem?._id && <img className='subcategory-image' src={'http://127.0.0.1:5000/' + newItem?.main_image} alt={newItem?.name_ru} />}
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
                        <div className='add-textarea'>
                            <Input.TextArea rows={5} name='desctiption_ru' placeholder='Полное описание (рус.)' value={newItem?.desctiption_ru} onChange={handleAddChange} />
                        </div>
                        <div className='add-textarea'>
                            <Input.TextArea rows={5} name='desctiption_tm' placeholder='Полное описание (туркм.)' value={newItem?.desctiption_tm} onChange={handleAddChange} />
                        </div>
                        <div className='add-textarea'>
                            <Input.TextArea rows={5} name='desctiption_en' placeholder='Полное описание (анг.)' value={newItem?.desctiption_en} onChange={handleAddChange} />
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
                    {/* <h2>{`Подкатегории (${total})`}</h2> */}
                    <h2>{`Товары`}</h2>
                    <div className='add-button' onClick={showAddModal}>Добавить</div>
                </div>
                <div className='subcategories-header-filters'>
                    <Input placeholder='Search' size='middle' value={searchValue} allowClear onChange={(e) => setSearchValue(e.target.value)} />
                </div>
                <TableComponent
                    active={selectedItem?._id}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{ onChange: onPaginationChange, total: total, pageSize: 20, position: ['topRight', 'bottomRight'] }}
                    onChange={handleTableChange}
                />
            </div>
        </>
    );
}

export default Products;