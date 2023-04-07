import { React, useEffect, useState } from 'react';
import { DatePicker, Modal, message, TimePicker } from 'antd';
import dayjs from 'dayjs';
import date from 'date-and-time';
import { axiosInstance } from '../../config/axios';
import TableComponent from '../../components/TableComponent';
import Input from 'antd/es/input/Input';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Checkbox from 'antd/es/checkbox/Checkbox';
dayjs.extend(customParseFormat);

function SmsTable() {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const today = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [toDate, setToDate] = useState(null);
    const [newItem, setNewItem] = useState(null);


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
                const res = await axiosInstance.patch(`sms-table/update/${newItem.id}/`, { sended: !newItem.sended });
                setDataSource(previousState => {
                    let a = previousState;
                    const index = a.findIndex(element => element.id === newItem.id);
                    a[index].sended = !a[index].sended
                    return a
                });
            } else {
                await axiosInstance.delete(`sms-table/delete/${selectedItem.id}`);
                const newDataSource = dataSource.filter(element => element.id !== selectedItem.id);
                setDataSource(newDataSource);
            }
            message.success('Успешно удалено');
            setSelectedItem(null);
            setNewItem(null);
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
        setNewItem(null);
        setSelectedItem(null);
    };

    useEffect(() => {
        axiosInstance.get('sms-table/list').then(res => {
            res.data?.forEach(element => {
                element.key = element.id
            });
            setDataSource(res?.data);
        }).catch(err => console.log(err));
    }, []);

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: '65px',
        },
        {
            title: 'Код',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Номер абонента',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Статус отправки',
            dataIndex: 'sended',
            key: 'sended',
            render: (_, record) => {
                return <Checkbox checked={record.sended} onChange={() => showModal(_, record)} />
            },
        },
        {
            title: 'Время отправки',
            dataIndex: 'sended_time',
            key: 'sended_time',
            render: (_, record) => (
                <p>{date.format(new Date(record.sended_time), 'YYYY-MM-DD / HH:MM:SS')}</p>
            ),
        },
        {
            title: 'Истекает время',
            dataIndex: 'expire_time',
            key: 'expire_time',
            render: (_, record) => (
                <p>{date.format(new Date(record.expire_time), 'YYYY-MM-DD / HH:MM:SS')}</p>
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

    //---------------------------------------------------ADD and ADD MODAL-------------------------------------------//
    const showAddModal = (item) => {
        if (item.type !== 'click') {
            setToDate(date.format(new Date(item.expire_time), 'YYYY-MM-DD HH:mm:ss'))
            setNewItem(item);
            setSelectedItem(item);
        };
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        setConfirmLoading(true);
        const formData = new FormData();
        newItem.expire_time = toDate;
        const keys = Object.keys(newItem);
        const values = Object.values(newItem);
        keys.forEach((key, index) => {
            formData.append(key, values[index]);
        })
        try {
            if (newItem?.id) {
                const res = await axiosInstance.put(`sms-table/update/${newItem.id}/`, formData);
                const index = dataSource.findIndex(item => item.id == newItem.id);
                setDataSource(previousState => {
                    const a = previousState;
                    a[index].phone_number = newItem.phone_number;
                    a[index].code = newItem.code;
                    a[index].sended = newItem.sended;
                    a[index].expire_time = toDate;
                    return a;
                })
            } else {
                const res = await axiosInstance.post('sms-table/add/', formData);
                res.data.key = res.data.id;
                setDataSource([...dataSource, res.data])
            }
            setNewItem(null);
            setToDate(null);
            message.success('Успешно')
            setAddOpen(false);
            setConfirmLoading(false);
        } catch (err) {
            message.error('Произошла ошибка. Пожалуйста, попробуйте еще раз!')
            setConfirmLoading(false)
        }
    };

    const handleAddCancel = () => {
        setAddOpen(false);
        setToDate(null);
        setNewItem(null);
    };

    const handleAddChange = (e) => {
        if (e.target.name == 'sended') {
            setNewItem({ ...newItem, [e.target.name]: [e.target.checked] });
        } else {
            setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
        }
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
                            Код:
                        </div>
                        <div className='add-column'>
                            Номер абонента:
                        </div>
                        {!newItem?.id && <div className='add-column'>
                            Статус отправки:
                        </div>}
                        <div className='add-column'>
                            Истекает время:
                        </div>
                    </div>
                    <div className='add-right'>
                        <div className='add-column'>
                            <Input name='code' placeholder='Код' value={newItem?.code} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='phone_number' placeholder='Номер абонента' value={newItem?.phone_number} onChange={handleAddChange} />
                        </div>
                        {!newItem?.id && <div className='add-column'>
                            <Checkbox name='sended' value={newItem?.sended} onChange={handleAddChange} />
                        </div>}
                        <div className='add-column'>
                            <DatePicker showTime value={toDate && dayjs(toDate, dateFormat)} onChange={(d, s) => setToDate(date.format(new Date(d), 'YYYY-MM-DD HH:mm:ss'))} />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                title={!newItem ? "Вы уверены, что хотите удалить?" : 'Вы уверены, что хотите изменить статус отправки?'}
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
                    <h2>СМС таблица</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent dataSource={dataSource} columns={columns} pagination={false} active={selectedItem?.id} />
            </div>
        </>
    );
}

export default SmsTable;