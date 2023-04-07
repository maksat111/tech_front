import { React, useEffect, useState } from 'react';
import { Modal, message, Select } from 'antd';
import { axiosInstance } from '../../config/axios';
import TableComponent from '../../components/TableComponent';
import Input from 'antd/es/input/Input';

function City() {
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [total, setTotal] = useState(null);
    const [selectOptions, setSelectOptions] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [newItem, setNewItem] = useState(null);


    const showModal = (item) => {
        setOpen(true);
        setSelectedItem(item);
    };

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            await axiosInstance.delete(`cities/delete/${selectedItem.id}/`);
            const newDataSource = dataSource.filter(element => element.id !== selectedItem.id);
            setDataSource(newDataSource);
            setSelectedItem(null);
            setOpen(false);
            setConfirmLoading(false);
            message.success('Успешно удалено!');
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        axiosInstance.get('cities/list').then(async res => {
            let a = [];
            let b = [];
            const data = await axiosInstance.get('regions/list/');
            data.data.forEach(item => {
                b.push({
                    label: item.name_ru,
                    value: item.name_ru,
                    id: item.id
                })
            })
            setSelectOptions(b);
            setTotal(res.data.count)
            res.data?.results.forEach(element => {
                a.push({
                    key: element.id,
                    id: element.id,
                    name_en: element.name_en,
                    name_tk: element.name_tk,
                    name_ru: element.name_ru,
                    region: element.region?.name_ru
                })
            });
            setDataSource(a);
        }).catch(err => console.log(err));
    }, []);

    const columns = [
        {
            title: 'Id',
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
            title: 'Регион',
            dataIndex: 'region',
            key: 'region',
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
                <div className='update-icon' onClick={() => showAddModal(record)}>
                    Изменить
                </div>
            ),
        },
    ];

    //---------------------------------------------------ADD MODAL-------------------------------------------//
    const showAddModal = (item) => {
        // setSelectedItem(item);
        if (item.id) {
            setNewItem(item);
            const filtered = selectOptions.filter(option => option.value == item.region);
            setSelectedRegion(filtered[0]);
            setSelectedItem(item);
        } else {
            setSelectedItem(null);
        }
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        setConfirmLoading(true);
        const formData = new FormData();
        newItem.region = selectedRegion.id;
        const keys = Object.keys(newItem);
        const values = Object.values(newItem);
        keys.forEach((key, index) => {
            formData.append(key, values[index]);
        })
        try {
            if (newItem.id) {
                const res = await axiosInstance.put(`cities/update/${newItem.id}/`, formData);
                const index = dataSource.findIndex(item => item.id == newItem.id);
                setDataSource(previousState => {
                    const a = previousState;
                    a[index].name_ru = newItem.name_ru;
                    a[index].name_en = newItem.name_en;
                    a[index].name_tk = newItem.name_tk;
                    a[index].region = selectedRegion.value;
                    return a;
                })
            } else {
                const res = await axiosInstance.post('cities/add/', formData);
                newItem.region = selectedRegion.value;
                newItem.id = res.data?.id;
                setDataSource([...dataSource, newItem])
            }
            setConfirmLoading(false);
            setSelectedRegion(null);
            setNewItem(null);
            message.success('Успешно')
            setAddOpen(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleAddCancel = () => {
        setAddOpen(false);
        setNewItem(null);
        setSelectedRegion(null);
    };

    const handleAddChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
    }

    //-------------------------------------------------------pagination -----------------------------------------//
    const onPaginationChange = async (page) => {
        let a = [];
        const res = await axiosInstance.get(`cities/list?page=${page}`);
        res.data.results?.forEach(element => {
            a.push({
                key: element.id,
                id: element.id,
                name_en: element.name_en,
                name_tk: element.name_tk,
                name_ru: element.name_ru,
                region: element.region?.name_ru
            })
        });
        setDataSource(a);
    }

    const handleSelectChange = (value) => {
        const filtered = selectOptions.filter(item => item.value == value);
        setSelectedRegion(filtered[0]);
    }

    return (
        <>
            <Modal
                title="Дополните детали"
                open={addOpen}
                onOk={handleAddOk}
                confirmLoading={confirmLoading}
                onCancel={handleAddCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                width={'600px'}
                okType={'primary'}
                style={{ top: '150px' }}
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
                            Регион:
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
                            <Input name='name_en' placeholder='Навзание (анг.)' value={newItem?.name_en} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                value={selectedRegion}
                                placeholder={'Регион'}
                                onChange={handleSelectChange}
                                options={selectOptions}
                            />
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
                cancelText={'Отмена'}
                okText={'Да'}
                okType={'primary'}
                okButtonProps={{ danger: true }}
                style={{
                    top: '200px'
                }}
            />
            <div className='page'>
                <div className='page-header-content'>
                    <h2>Города и этрапы</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ onChange: onPaginationChange, total: total, pageSize: 20 }}
                    active={selectedItem?.id}
                />
            </div>
        </>
    );
}

export default City;