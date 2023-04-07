import { React, useEffect, useState } from 'react';
import { DatePicker, Modal, message, Select } from 'antd';
import dayjs from 'dayjs';
import date from 'date-and-time';
import { axiosInstance } from '../../config/axios';
import TableComponent from '../../components/TableComponent';
import Input from 'antd/es/input/Input';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Checkbox from 'antd/es/checkbox/Checkbox';
dayjs.extend(customParseFormat);

function Clients() {
    const dateFormat = 'YYYY-MM-DD';
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const today = date.format(new Date(), 'YYYY-MM-DD');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [birthday, setBirthday] = useState(null);
    const [newItem, setNewItem] = useState(null);
    const [userTypeOption, setUserTypeOption] = useState(null);
    const [regionOption, setRegionOption] = useState(null);
    const [newItemUserType, setNewItemUserType] = useState(null);
    const [newItemRegion, setNewItemRegion] = useState(null);

    useEffect(() => {
        axiosInstance.get('users/list').then(async res => {
            let a = [];
            let b = [];
            res.data?.forEach((element) => {
                element.key = element.id;
                element.id = element.id;
                element.clients_type = element.clients_type.name_ru;
                element.region = element.region ? element.region.name_ru : 'null';
            });
            const userType = await axiosInstance.get('users/types/list/');
            userType.data.forEach(element => {
                a.push({
                    id: element.id,
                    label: element.name_ru,
                    value: element.name_ru,
                })
            });
            const regions = await axiosInstance.get('regions/list/');
            regions.data.forEach(element => {
                b.push({
                    id: element.id,
                    label: element.name_ru,
                    value: element.name_ru,
                });
            })
            setRegionOption(b);
            setUserTypeOption(a);
            setDataSource(res?.data);
        }).catch(err => console.log(err));
    }, []);

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            display: 'none',
            width: '65px',
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Фамилия',
            dataIndex: 'surname',
            key: 'surname',
        },
        {
            title: 'Электронная почта',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: '100px'
        },
        {
            title: 'День рождения',
            dataIndex: 'birthday',
            key: 'birthday',
            width: '120px',
            render: (_, record) => (
                <p>{record.birthday ? date.format(new Date(record.birthday), 'YYYY-MM-DD') : 'null'}</p>
            ),
        },
        {
            title: 'Тип клиентов',
            dataIndex: 'clients_type',
            key: 'clients_type',
        },
        {
            title: 'Регион',
            dataIndex: 'region',
            key: 'region',
        },
        {
            title: 'Staff',
            dataIndex: 'is_staff',
            key: 'is_staff',
            render: (_, record) => (
                <Checkbox checked={record.is_staff} onChange={() => showModal(_, record)} />
            ),
        },
        {
            title: 'Admin',
            dataIndex: 'is_admin',
            key: 'is_admin',
            render: (_, record) => (
                <Checkbox checked={record.is_admin} onChange={() => showModal(_, record)} />
            ),
        },
        {
            title: 'Дата регистрации',
            dataIndex: 'registered_date',
            key: 'registered_date',
            width: '110px',
            render: (_, record) => (
                <p>{date.format(new Date(record.registered_date), 'YYYY-MM-DD')}</p>
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
                <div className='update-icon' onClick={() => showAddModal(record)}>
                    Изменить
                </div>
            ),
        },
    ];

    const showModal = (item, item2) => {
        if (item2) {
            setNewItem(item2);
        }
        setSelectedItem(item);
        setOpen(true);
    };

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            if (newItem) {
                const res = await axiosInstance.patch(`users/update/${newItem.id}/`, { active: !newItem.active });
                setDataSource(previousState => {
                    let a = previousState;
                    const index = a.findIndex(element => element.id === newItem.id);
                    a[index].active = !a[index].active
                    return a
                });
            } else {
                await axiosInstance.delete(`users/delete/${selectedItem.id}`);
                const newDataSource = dataSource.filter(element => element.id !== selectedItem.id);
                setDataSource(newDataSource);
            }
            message.success('Успешно');
            setNewItem(null);
            setConfirmLoading(false);
            setOpen(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setNewItem(null);
    };


    //---------------------------------------------------ADD MODAL-------------------------------------------//
    const showAddModal = (item) => {
        if (item.id) {
            item.birthday && setBirthday(date.format(new Date(item.birthday), 'YYYY-MM-DD'));
            setNewItemUserType(item.clients_type);
            setNewItemRegion(item.region);
            setSelectedItem(item);
            setNewItem(item);
        };
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        setConfirmLoading(true);
        const formData = new FormData();
        newItem.birthday = birthday;
        newItem.region = newItemRegion?.id;
        newItem.clients_type = newItemUserType?.id;
        const keys = Object.keys(newItem);
        const values = Object.values(newItem);
        keys.forEach((key, index) => {
            formData.append(key, values[index]);
        })
        try {
            if (newItem.id) {
                const res = await axiosInstance.put(`users/update/${newItem.id}/`, formData);
                const foundedIndex = dataSource.findIndex(item => item.id == newItem.id);
                setDataSource(previousState => {
                    const a = previousState;
                    a[foundedIndex].name = newItem.name;
                    a[foundedIndex].surname = newItem.surname;
                    a[foundedIndex].email = newItem.email;
                    a[foundedIndex].phone_number = newItem.phone_number;
                    a[foundedIndex].birthday = newItem.birthday;
                    a[foundedIndex].clients_type = newItemUserType.value;
                    a[foundedIndex].region = newItemRegion.value;
                    a[foundedIndex].is_staff = newItem.is_staff;
                    a[foundedIndex].is_admin = newItem.is_admin;
                    a[foundedIndex].registered_date = newItem.registered_date;
                    return a;
                })
            } else {
                const res = await axiosInstance.post('users/add/', formData);
                const added = {
                    name: newItem.name,
                    surname: newItem.surname,
                    email: newItem.email,
                    phone_number: newItem.phone_number,
                    birthday: newItem.birthday,
                    clients_type: newItemUserType.value,
                    region: newItemRegion.value,
                    is_staff: newItem.is_staff,
                    is_admin: newItem.is_admin,
                    registered_date: today,
                }
                setDataSource([...dataSource, added]);
            }
            setNewItem(null);
            setNewItemRegion(null);
            setNewItemUserType(null);
            setBirthday(null);
            message.success('Успешно!')
            setConfirmLoading(false);
            setAddOpen(false);
        } catch (err) {
            setConfirmLoading(false)
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            console.log(err)
        }
    };

    const handleAddCancel = () => {
        setNewItem(null)
        setNewItemRegion(null);
        setNewItemUserType(null);
        setBirthday(null);
        setAddOpen(false);
    };

    const handleAddChange = (e) => {
        e.target.name == 'is_admin' || e.target.name == 'is_staff'
            ? setNewItem({ ...newItem, [e.target.name]: [e.target.checked] })
            : setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
    }

    const handleUpdateSelectChange = (e) => {
        const filtered = userTypeOption.filter(item => item.value == e);
        setNewItemUserType(filtered[0]);
    }

    const handleRegionSelect = (e) => {
        const filtered = regionOption.filter(item => item.value == e);
        setNewItemRegion(filtered[0]);
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
                centered
            >
                <form className='banner-add-container'>
                    <div className='add-left'>
                        <div className='add-column'>
                            Имя:
                        </div>
                        <div className='add-column'>
                            Фамилия:
                        </div>
                        <div className='add-column'>
                            Электронная почта:
                        </div>
                        <div className='add-column'>
                            Номер телефона:
                        </div>
                        <div className='add-column'>
                            День рождения:
                        </div>
                        <div className='add-column'>
                            Тип клиентов:
                        </div>
                        <div className='add-column'>
                            Регион:
                        </div>
                        {!newItem?.id && <div className='add-column'>
                            Staff
                        </div>}
                        {!newItem?.id && <div className='add-column'>
                            Admin
                        </div>}
                        <div className='add-column'>
                            Пароль:
                        </div>
                        <div className='add-column'>
                            Пароль 2:
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-column'>
                            <Input name='name' placeholder='Имя' required value={newItem?.name} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='surname' placeholder='Фамилия' required value={newItem?.surname} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='email' type='email' required placeholder='Электронная почта' value={newItem?.email} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='phone_number' type='number' required placeholder='Номер телефона' value={newItem?.phone_number} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <DatePicker allowClear required value={birthday && dayjs(birthday, dateFormat)} onChange={(d) => setBirthday(date.format(new Date(d), 'YYYY-MM-DD'))} />
                        </div>
                        <div className='add-column'>
                            <Select
                                showSearch
                                aria-required={true}
                                value={newItemUserType}
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Тип клиентов"
                                onChange={(e) => handleUpdateSelectChange(e)}
                                options={userTypeOption}
                            />
                        </div>
                        <div className='add-column'>
                            <Select
                                aria-required={true}
                                showSearch
                                value={newItemRegion}
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Регион"
                                onChange={(e) => handleRegionSelect(e)}
                                options={regionOption}
                            />
                        </div>
                        {!newItem?.id && <div className='add-column'>
                            <Checkbox name='is_staff' value={newItem?.is_staff} onChange={handleAddChange} />
                        </div>}
                        {!newItem?.id && <div className='add-column'>
                            <Checkbox name='is_admin' value={newItem?.is_admin} onChange={handleAddChange} />
                        </div>}
                        <div className='add-column'>
                            <Input name='password' placeholder='Новый пароль' value={newItem?.password} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='password2' placeholder='Новый пароль 2' value={newItem?.password2} onChange={handleAddChange} />
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                title={!newItem ? "Вы уверены, что хотите удалить?" : 'Вы уверены, что хотите изменить активност?'}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                cancelText={'Отмена'}
                okText={'Да'}
                okType={'primary'}
                okButtonProps={!newItem && { danger: true }}
                style={{
                    top: '200px'
                }}
            />
            <div className='page'>
                <div className='page-header-content'>
                    <h2>Клиенты</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent dataSource={dataSource} columns={columns} pagination={false} active={selectedItem?.id} />
            </div>
        </>
    );
}

export default Clients;