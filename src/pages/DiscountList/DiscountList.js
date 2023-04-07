import { React, useEffect, useState } from 'react';
import { DatePicker, Modal, message } from 'antd';
import dayjs from 'dayjs';
import date from 'date-and-time';
import { axiosInstance } from '../../config/axios';
import TableComponent from '../../components/TableComponent';
import Input from 'antd/es/input/Input';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Checkbox from 'antd/es/checkbox/Checkbox';
dayjs.extend(customParseFormat);

function DiscountList() {
    const dateFormat = 'YYYY-MM-DD';
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const today = date.format(new Date(), 'YYYY-MM-DD');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [newItem, setNewItem] = useState(null)


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
                const res = await axiosInstance.patch(`discounts/update/${newItem.id}/`, { active: !newItem.active });
                setDataSource(previousState => {
                    let a = previousState;
                    const index = a.findIndex(element => element.id === newItem.id);
                    a[index].active = !a[index].active
                    return a
                });
            } else {
                await axiosInstance.delete(`discounts/delete/${selectedItem.id}`);
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

    useEffect(() => {
        axiosInstance.get('discounts/list').then(res => {
            res.data?.forEach(element => {
                element.key = element.id
            });
            setDataSource(res?.data);
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
            title: 'Старая цена',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Процент скидки',
            dataIndex: 'discount_percent',
            key: 'discount_percent',
        },
        {
            title: 'Описание',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: 'Активная',
            dataIndex: 'active',
            key: 'active',
            render: (_, record) => (
                <Checkbox checked={record.active} onChange={() => showModal(_, record)} />
            ),
        },
        {
            title: 'Дата создания',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (_, record) => (
                <p>{date.format(new Date(record.created_date), 'YYYY-MM-DD / HH:MM:SS')}</p>
            ),
        },
        {
            title: 'От числа',
            dataIndex: 'from_date',
            key: 'from_date',
            render: (_, record) => (
                <p>{date.format(new Date(record.from_date), 'YYYY-MM-DD')}</p>
            ),
        },
        {
            title: 'До числа',
            dataIndex: 'to_date',
            key: 'to_date',
            render: (_, record) => (
                <p>{date.format(new Date(record.to_date), 'YYYY-MM-DD')}</p>
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

    //---------------------------------------------------ADD MODAL-------------------------------------------//
    const showAddModal = (item) => {
        // setSelectedItem(item);
        if (item.id) {
            setFromDate(date.format(new Date(item.from_date), 'YYYY-MM-DD'))
            setToDate(date.format(new Date(item.to_date), 'YYYY-MM-DD'))
            setNewItem(item);
        };
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        setConfirmLoading(true);
        const formData = new FormData();
        newItem.from_date = fromDate;
        newItem.to_date = toDate;
        const keys = Object.keys(newItem);
        const values = Object.values(newItem);
        keys.forEach((key, index) => {
            formData.append(key, values[index]);
        })
        try {
            if (newItem.id) {
                const res = await axiosInstance.put(`discounts/update/${newItem.id}/`, formData);
                const foundedIndex = dataSource.findIndex(item => item.id == newItem.id);
                setDataSource(previousState => {
                    const a = previousState;
                    keys.forEach((key, index) => {
                        a[foundedIndex][key] = values[index];
                    });
                    return a;
                })
            } else {
                const res = await axiosInstance.post('discounts/add/', formData);
                res.data.key = res.data.id;
                setDataSource([...dataSource, res.data])
            }
            setNewItem(null);
            message.success('Успешно')
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
        setAddOpen(false);
        setToDate(null);
        setFromDate(null);
    };

    const handleAddChange = (e) => {
        e.target.name == 'active'
            ? setNewItem({ ...newItem, [e.target.name]: [e.target.checked] })
            : setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
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
                style={{ top: '50px' }}
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
                            Старая цена:
                        </div>
                        <div className='add-column'>
                            Процент скидки:
                        </div>
                        {!newItem?.id && <div className='add-column'>
                            Активная
                        </div>}
                        <div className='add-column'>
                            Описание:
                        </div>
                        <div className='add-column'>
                            От числа:
                        </div>
                        <div className='add-column'>
                            До числв:
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
                            <Input name='price' type='number' placeholder='Старая цена' value={newItem?.price} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input name='discount_percent' type='number' placeholder='Процент скидки' value={newItem?.discount_percent} onChange={handleAddChange} />
                        </div>
                        {!newItem?.id && <div className='add-column'>
                            <Checkbox name='active' value={newItem?.active} onChange={handleAddChange} />
                        </div>}
                        <div className='add-column'>
                            <Input name='desc' placeholder='Описание' value={newItem?.desc} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <DatePicker allowClear value={fromDate && dayjs(fromDate, dateFormat)} onChange={(d) => setFromDate(date.format(new Date(d), 'YYYY-MM-DD'))} />
                        </div>
                        <div className='add-column'>
                            <DatePicker allowClear value={toDate && dayjs(toDate, dateFormat)} onChange={(d) => setToDate(date.format(new Date(d), 'YYYY-MM-DD'))} />
                        </div>
                    </div>
                </div>
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
                    <h2>Виды скидок</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent dataSource={dataSource} columns={columns} pagination={false} />
            </div>
        </>
    );
}

export default DiscountList;