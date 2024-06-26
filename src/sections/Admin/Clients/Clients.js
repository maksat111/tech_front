import { React, useEffect, useState } from "react";
import { DatePicker, Modal, message, Select, Checkbox, Input } from "antd";
import dayjs from "dayjs";
import date from "date-and-time";
import { axiosInstance } from "../../../config/axios";
import TableComponent from "../../../components/Admin/TableComponent";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./Clients.css";
dayjs.extend(customParseFormat);

function Clients() {
  const dateFormat = "YYYY-MM-DD";
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const today = date.format(new Date(), "YYYY-MM-DD");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [birthday, setBirthday] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [userTypeOption, setUserTypeOption] = useState(null);
  const [regionOption, setRegionOption] = useState(null);
  const [newItemUserType, setNewItemUserType] = useState(null);
  const [newItemRegion, setNewItemRegion] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [ordering, setOrdering] = useState({});

  useEffect(() => {
    axiosInstance
      .get("admin/user/list")
      .then(async (res) => {
        res.data.data?.forEach((element) => {
          element.key = element._id;
        });
        setDataSource(res?.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    {
      title: "Ady",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Familiýasy",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefon nomeri",
      dataIndex: "phone_number",
      key: "phone_number",
      width: "100px",
    },
    {
      title: "Registrasiýa wagty",
      dataIndex: "registered_date",
      key: "registered_date",
      width: "110px",
      render: (_, record) => (
        <p>{date.format(new Date(record.createdAt), "YYYY-MM-DD")}</p>
      ),
    },
    {
      title: "Pozmak",
      dataIndex: "active",
      key: "active",
      width: "110px",
      render: (_, record) => (
        <div className="delete-icon" onClick={() => showModal(record)}>
          Pozmak
        </div>
      ),
    },
    {
      title: "Üýtgetmek",
      dataIndex: "active",
      key: "active",
      width: "125px",
      render: (_, record) => (
        <div className="update-icon" onClick={() => showAddModal(record)}>
          Üýtgetmek
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
        const res = await axiosInstance.patch(
          `admin/user/update/${newItem._id}`,
          { active: !newItem.active }
        );
        setDataSource((previousState) => {
          let a = previousState;
          const index = a.findIndex((element) => element._id === newItem._id);
          a[index].is_active = !a[index].is_active;
          return a;
        });
      } else {
        await axiosInstance.delete(`admin/user/delete/${selectedItem._id}`);
        const newDataSource = dataSource.filter(
          (element) => element._id !== selectedItem._id
        );
        setDataSource(newDataSource);
      }
      message.success("Успешно!");
      setNewItem(null);
      setConfirmLoading(false);
      setOpen(false);
    } catch (err) {
      setConfirmLoading(false);
      message.error("Произошла ошибка. Пожалуйста, попробуйте еще раз!");
      console.log(err);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setNewItem(null);
  };

  //---------------------------------------------------ADD MODAL-------------------------------------------//
  const showAddModal = (item) => {
    if (item._id) {
      setSelectedItem(item);
      setNewItem(item);
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
    });
    try {
      if (newItem._id) {
        const res = await axiosInstance.patch(
          `admin/user/update/${newItem._id}`,
          formData
        );
        const foundedIndex = dataSource.findIndex(
          (item) => item._id == newItem._id
        );
        setDataSource((previousState) => {
          const a = previousState;
          a[foundedIndex].name = newItem.name;
          a[foundedIndex].surname = newItem.surname;
          a[foundedIndex].email = newItem.email;
          a[foundedIndex].phone_number = newItem.phone_number;
          a[foundedIndex].createdAt = newItem.createdAt;
          return a;
        });
      } else {
        const res = await axiosInstance.post("admin/user/create", formData);
        const added = {
          key: res.data.data._id,
          name: newItem.name,
          surname: newItem.surname,
          email: newItem.email,
          phone_number: newItem.phone_number,
          createdAt: today,
        };
        setDataSource([...dataSource, added]);
      }
      setNewItem(null);
      message.success("Успешно!");
      setConfirmLoading(false);
      setAddOpen(false);
    } catch (err) {
      setConfirmLoading(false);
      message.error("Произошла ошибка. Пожалуйста, попробуйте еще раз!");
      console.log(err);
    }
  };

  const handleAddCancel = () => {
    setNewItem(null);
    setAddOpen(false);
  };

  const handleAddChange = (e) => {
    e.target.name == "is_admin" || e.target.name == "is_staff"
      ? setNewItem({ ...newItem, [e.target.name]: [e.target.checked] })
      : setNewItem({ ...newItem, [e.target.name]: [e.target.value] });
  };

  const handleTableChange = async (a, b, c) => {
    const data = [];
    if (c.field !== ordering?.field || c.order !== ordering?.order) {
      setOrdering((previousState) => {
        let a = previousState;
        a.field = c.field;
        a.order = c.order;
        return a;
      });
      if (c.order == "ascend") {
        var query = `admin/user/list?ordering=${c.field}`;
      } else {
        var query = `admin/user/list?ordering=-${c.field}`;
      }
      axiosInstance
        .get(query)
        .then((res) => {
          res.data.data?.forEach((element) => {
            element.key = element._id;
            element._id = element._id;
          });
          setDataSource(res.data.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    axiosInstance.get(`admin/user/list?search=${searchValue}`).then((res) => {
      res.data.data?.forEach((element) => {
        element.key = element._id;
      });
      setDataSource(res.data.data);
    });
  }, [searchValue]);

  return (
    <>
      <Modal
        title="Дополните детали"
        open={addOpen}
        onOk={handleAddOk}
        confirmLoading={confirmLoading}
        onCancel={handleAddCancel}
        cancelText={"Отмена"}
        okText={"Да"}
        width={"600px"}
        okType={"primary"}
        centered
      >
        <form className="banner-add-container">
          <div className="add-left">
            <div className="add-column">Adyž:</div>
            <div className="add-column">Familiýasy:</div>
            <div className="add-column">Email:</div>
            <div className="add-column">Telefon nomeri:</div>
            <div className="add-column">Açar sözi:</div>
            {newItem?._id && <div className="add-column">Täze Açar sözi:</div>}
          </div>
          <div className="add-right">
            <div className="add-column">
              <Input
                name="name"
                placeholder="Имя"
                required
                value={newItem?.name}
                onChange={handleAddChange}
              />
            </div>
            <div className="add-column">
              <Input
                name="surname"
                placeholder="Familiýasy"
                required
                value={newItem?.surname}
                onChange={handleAddChange}
              />
            </div>
            <div className="add-column">
              <Input
                name="email"
                type="email"
                required
                placeholder="Email"
                value={newItem?.email}
                onChange={handleAddChange}
              />
            </div>
            <div className="add-column">
              <Input
                name="phone_number"
                type="number"
                required
                placeholder="Telefon nomeri"
                value={newItem?.phone_number}
                onChange={handleAddChange}
              />
            </div>
            <div className="add-column">
              <Input
                name="password"
                placeholder="Açar sözi"
                value={newItem?.password}
                onChange={handleAddChange}
              />
            </div>
            {newItem?._id && (
              <div className="add-column">
                <Input
                  name="new_password"
                  placeholder="Taze açar sözi"
                  value={newItem?.new_password}
                  onChange={handleAddChange}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        title={
          !newItem
            ? "Siz hakykatdanam pozmakçymy?"
            : "Siz aktiwligi üýtgetmekçimi?"
        }
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelText={"Ýok"}
        okText={"Howwa"}
        okType={"primary"}
        okButtonProps={!newItem && { danger: true }}
        style={{
          top: "200px",
        }}
      />
      <div className="page">
        <div className="page-header-content">
          <h2 className="admin-section-name">Müşderiler</h2>
          <div className="add-button" onClick={showAddModal}>
            Girizmek
          </div>
        </div>
        <div className="users-header-filters"></div>
        <TableComponent
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          active={selectedItem?._id}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default Clients;
