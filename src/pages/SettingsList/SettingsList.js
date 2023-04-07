import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/TableComponent';
import { axiosInstance } from '../../config/axios';
import { Modal, message, Upload, Checkbox, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import './SettingsList.css';
import Input from 'antd/es/input/Input';

function SettingsList() {
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [total, setTotal] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [selectOptions, setSelectOptions] = useState(null);
    const [selectedGroupOption, setSelectedGroupOption] = useState([])
    const [newItem, setNewItem] = useState(null);
    const [pageSize, setPageSize] = useState(null);

    useEffect(() => {
        axiosInstance.get('options/list').then(async (res) => {
            let a = [];
            let b = [];
            setTotal(res.data.count);
            setPageSize(res.data.results.length);
            res.data?.results.forEach(element => {
                a.push({
                    id: element.id,
                    key: element.id,
                    name_ru: element.name_ru,
                    name_en: element.name_en,
                    name_tk: element.name_tk,
                    option_group: element.option_group.name_ru
                })
            });
            setDataSource(a);
            const groupOptions = await axiosInstance.get('options-group/list/');
            groupOptions.data?.forEach(item => {
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
            title: 'Группа опций',
            dataIndex: 'option_group',
            key: 'option_group',
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
            await axiosInstance.delete(`options/delete/${selectedItem.id}/`);
            const newDataSource = dataSource.filter(element => element.id !== selectedItem.id);
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
            const filtered = selectOptions.filter(groupOption => groupOption.name_ru == item.option_group);
            setSelectedGroupOption([{ id: filtered[0]?.id, label: item.option_group, value: item.option_group }])
            setNewItem(item);
        }
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        try {
            if (newItem.id) {
                const formData = new FormData();
                formData.append("name_ru", newItem.name_ru);
                formData.append("name_en", newItem.name_en);
                formData.append("name_tk", newItem.name_tk);
                formData.append('option_group', selectedGroupOption[0].id);
                const res = await axiosInstance.patch(`options/update/${newItem.id}/`, formData);
                const index = dataSource.findIndex(item => item.id == newItem.id);
                setDataSource(previousState => {
                    const a = previousState;
                    a[index].name_ru = newItem.name_ru;
                    a[index].name_en = newItem.name_en;
                    a[index].name_tk = newItem.name_tk;
                    a[index].option_group = selectedGroupOption[0].value;
                    return a;
                })
            } else {
                let a = [];
                setConfirmLoading(true);
                selectedGroupOption.forEach(async groupOption => {
                    const formData = new FormData();
                    formData.append("name_ru", newItem.name_ru);
                    formData.append("name_en", newItem.name_en);
                    formData.append("name_tk", newItem.name_tk);
                    formData.append('option_group', groupOption.id);
                    const res = await axiosInstance.post(`options/add/`, formData);
                    res.data.key = res.data.id;
                    a.push(res.data);
                })
                setDataSource([...dataSource, ...a]);
            }
            setSelectedGroupOption([]);
            setNewItem(null);
            message.success('Успешно добавлено');
            setConfirmLoading(false);
            setAddOpen(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleAddCancel = () => {
        setSelectedGroupOption([]);
        setNewItem(null);
        setAddOpen(false);
    };

    const handleAddChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
    }

    //-------------------------------------------------------pagination -----------------------------------------//
    const onPaginationChange = async (page) => {
        let a = [];
        const res = await axiosInstance.get(`options/list?page=${page}`);
        res.data.results?.forEach(element => {
            a.push({
                id: element.id,
                key: element.id,
                name_ru: element.name_ru,
                name_en: element.name_en,
                name_tk: element.name_tk,
                option_group: element.option_group.name_ru
            })
        });
        setDataSource(a);
    }

    const handleUpdateSelectChange = (e) => {
        let a = [];
        selectOptions.forEach(item => {
            e.forEach(selected => item.value == selected && a.push({ id: item.id, label: selected, value: selected }));
        });
        setSelectedGroupOption(a);
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
                            Группа опций:
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
                                value={selectedGroupOption}
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Выберите группа опцию"
                                onChange={(e) => handleUpdateSelectChange(e)}
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
                    <h2>Список опций</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent
                    active={selectedItem?.id}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{ onChange: onPaginationChange, total: total, pageSize: pageSize, showQuickJumper: true }}
                />
            </div>
        </>
    );
}

export default SettingsList;