import { React, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Checkbox, message } from 'antd';
import { axiosInstance } from '../../config/axios';
import TableComponent from '../../components/TableComponent';
import Input from 'antd/es/input/Input';

function DeliveryType() {
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [newItem, setNewItem] = useState(null);


    const showModal = (item) => {
        setOpen(true);
        setSelectedItem(item);
    };

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            await axiosInstance.delete(`delivery-type/delete/${selectedItem.id}`);
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

    useEffect(() => {
        axiosInstance.get('delivery-type/list').then(res => {
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
            style: { alignItems: "center" }
        },
        {
            title: 'Название',
            dataIndex: 'name_ru',
            key: 'name_ru',
        },
        {
            title: 'Срок доставки',
            dataIndex: 'delivery_days',
            key: 'delivery_days',
        },
        {
            title: 'Стоимость доставки',
            dataIndex: 'delivery_amount',
            key: 'delivery_amount',
        },
        {
            title: 'Активный',
            dataIndex: 'active',
            key: 'active',
            render: (_, record) => (
                <Checkbox checked={record.active} />
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
        if (item.id) {
            setNewItem(item);
            setSelectedItem(item);
        }
        setAddOpen(true);
    };

    const handleAddOk = async () => {
        setConfirmLoading(true);
        const formData = new FormData();
        const keys = Object.keys(newItem);
        const values = Object.values(newItem);
        keys.forEach((key, index) => {
            formData.append(key, values[index]);
        })
        try {
            if (newItem.id) {
                const res = await axiosInstance.put(`delivery-type/update/${newItem.id}/`, formData);
                const index = dataSource.findIndex(item => item.id == newItem.id);
                setDataSource(previousState => {
                    const a = previousState;
                    a[index].name_ru = newItem.name_ru;
                    a[index].active = newItem.active;
                    a[index].delivery_days = newItem.delivery_days;
                    a[index].delivery_amount = newItem.delivery_amount;
                    return a;
                })
            } else {
                const res = await axiosInstance.post('delivery-type/add/', formData);
                setDataSource([...dataSource, newItem])
            }
            setConfirmLoading(false);
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
        setNewItem(null);
        setAddOpen(false);
    };

    const handleAddChange = (e) => {
        e.target.name === 'active'
            ? setNewItem({ ...newItem, [e.target.name]: [e.target.checked] })
            : setNewItem({ ...newItem, [e.target.name]: [e.target.value] })
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
                            Срок доставки:
                        </div>
                        <div className='add-column'>
                            Стоимость доставки:
                        </div>
                        <div className='add-column'>
                            Активный:
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
                            <Input name='delivery_days' placeholder='Срок доставки' value={newItem?.delivery_days} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Input type='number' name='delivery_amount' placeholder='Стоимость доставки' value={newItem?.delivery_amount} onChange={handleAddChange} />
                        </div>
                        <div className='add-column'>
                            <Checkbox name='active' placeholder='Активный' checked={newItem?.active} onChange={(e) => setNewItem({ ...newItem, active: e.target.checked })} />
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
                    <h2>Виды доставок</h2>
                    <div className='add-button' onClick={showAddModal}>Добавлять</div>
                </div>
                <TableComponent dataSource={dataSource} columns={columns} pagination={false} active={selectedItem?.id} />
            </div>
        </>
    );
}

export default DeliveryType;