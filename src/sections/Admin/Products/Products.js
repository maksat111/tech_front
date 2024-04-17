import React, { useEffect, useState } from "react";
import TableComponent from "../../../components/Admin/TableComponent";
import { axiosInstance } from "../../../config/axios";
import { Modal, message, Upload, Checkbox, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Products.css";
import "../Subcategories/Subcategories.css";
import Input from "antd/es/input/Input";

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
  const [brandOptions, setBrandOptions] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [newItemCategory, setNewItemCategory] = useState([]);
  const [newItemBrand, setNewItemBrand] = useState([]);
  const [newItem, setNewItem] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [ordering, setOrdering] = useState({});

  useEffect(() => {
    axiosInstance
      .get("admin/product/list")
      .then(async (res) => {
        let a = [];
        let b = [];
        let c = [];
        let d = [];
        setTotal(res.data.count);
        res.data?.data.forEach((element) => {
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
            brand: element.brand.name,
          });
        });
        setDataSource(a);
        const categories = await axiosInstance.get("admin/category/list");
        categories.data.data?.forEach((item) => {
          b.push({
            label: item.name_ru,
            value: item.name_ru,
            _id: item._id,
          });
        });

        setSelectOptions(b);

        const brands = await axiosInstance.get("admin/brand/list");
        brands.data.data?.forEach((item) => {
          d.push({
            label: item.name,
            value: item.name,
            _id: item._id,
          });
        });
        setBrandOptions(d);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    {
      title: "Esasy surat",
      dataIndex: "main_image",
      key: "main_image",
      render: (_, record) => (
        <img
          className="category-image"
          src={"http://127.0.0.1:5000/" + record.main_image}
          alt={record.name_ru}
        />
      ),
    },
    {
      title: "Ady (rusça.)",
      dataIndex: "name_ru",
      key: "name_ru",
    },
    {
      title: "Kategoriýa",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Marka",
      dataIndex: "brand",
      key: "brand",
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

  const showModal = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const newDataSource = dataSource.filter(
        (element) => element._id !== selectedItem._id
      );
      await axiosInstance.delete(`admin/product/delete/${selectedItem._id}/`);
      setDataSource(newDataSource);
      message.success("Успешно удалено!");
      setOpen(false);
      setConfirmLoading(false);
    } catch (err) {
      setConfirmLoading(false);
      message.error("Произошла ошибка. Пожалуйста, попробуйте еще раз!");
      console.log(err);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //-----------------------------------------Add Modal-------------------------------------------------//
  const showAddModal = (item) => {
    if (item._id) {
      setSelectedItem(item);
      const filteredCategory = selectOptions.filter(
        (e) => e.value == item.category
      );
      setNewItemCategory(filteredCategory[0]);
      const filteredBrand = brandOptions.filter((e) => e.value == item.brand);
      setNewItemBrand(filteredBrand[0]);
      setNewItem(item);
      console.log(item);
    }
    setAddOpen(true);
  };

  const handleAddOk = async (e) => {
    e.preventDefault();
    try {
      setConfirmLoading(true);
      // if (newItemCategory.length === 0 || newItemBrand.length === 0) {
      //   return message.error("Все поля обязательны для заполнения!");
      // }
      const formData = new FormData();
      fileList[0] &&
        formData.append(
          "main_image",
          fileList[0].originFileObj,
          fileList[0].originFileObj.name
        );
      formData.append("name_ru", newItem.name_ru);
      formData.append("name_en", newItem.name_en);
      formData.append("name_tm", newItem.name_tm);
      formData.append("description_ru", newItem.description_ru);
      formData.append("description_en", newItem.description_en);
      formData.append("description_tm", newItem.description_tm);
      formData.append("price", newItem.price);
      formData.append("category", newItemCategory._id);
      formData.append("brand", newItemBrand._id);
      if (newItem._id) {
        const res = await axiosInstance.patch(
          `admin/product/update/${newItem._id}`,
          formData
        );
        const index = dataSource.findIndex((item) => item._id == newItem._id);
        setDataSource((previousState) => {
          const a = previousState;
          a[index].name_ru = newItem.name_ru;
          a[index].name_en = newItem.name_en;
          a[index].name_tm = newItem.name_tm;
          a[index].description_ru = newItem.description_ru;
          a[index].description_en = newItem.description_en;
          a[index].description_tm = newItem.description_tm;
          a[index].main_image = res.data.data.main_image;
          a[index].category = newItemCategory.value;
          a[index].brand = newItemBrand.value;
          return a;
        });
      } else {
        const res = await axiosInstance.post(`admin/product/create`, formData);
        if (res.data.success === 0) message.error(res.data.msg);
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
          brand: newItemBrand.value,
        };

        setDataSource([...dataSource, a]);
      }
      setNewItemCategory([]);
      setNewItemBrand([]);
      setFileList([]);
      setNewItem(null);
      message.success("Успешно добавлено!");
      setAddOpen(false);
      setConfirmLoading(false);
    } catch (err) {
      setConfirmLoading(false);
      console.log(err);
      message.error("Произошла ошибка. Пожалуйста, попробуйте еще раз!");
    }
  };

  const handleAddCancel = () => {
    setNewItemCategory([]);
    setNewItemBrand([]);
    setFileList([]);
    setNewItem(null);
    setAddOpen(false);
  };

  const handleAddCustomRequest = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    try {
      onSuccess("Ok");
    } catch (err) {
      onError("Upload error");
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
  };

  //-------------------------------------------------------pagination -----------------------------------------//
  const onPaginationChange = async (page) => {
    let a = [];
    const res = await axiosInstance.get(`admin/product/list?page=${page}`);
    res.data.data?.forEach((element) => {
      a.push({
        key: element._id,
        _id: element._id,
        main_image: "http://127.0.0.1:5000/" + element.main_image,
        name_ru: element.name_ru,
        name_en: element.name_en,
        name_tm: element.name_tm,
        description_tm: element.description_tm,
        description_ru: element.description_ru,
        description_en: element.description_en,
        category: element.category.name_ru,
        brand: element.brand.name,
      });
    });
    setDataSource(a);
  };

  const handleUpdateSelectChange = (e) => {
    const filtered = selectOptions.filter((item) => item.value == e);
    setNewItemCategory(filtered[0]);
  };

  const handleBrandChange = (e) => {
    const filtered = brandOptions.filter((item) => item.value == e);
    setNewItemBrand(filtered[0]);
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
        var query = `admin/product/list?ordering=${c.field}`;
      } else {
        var query = `admin/product/list?ordering=-${c.field}`;
      }
      axiosInstance
        .get(query)
        .then((res) => {
          setTotal(res.data.count);
          res.data?.data.forEach((element) => {
            data.push({
              key: element._id,
              _id: element._id,
              main_image: "http://127.0.0.1:5000/" + element.main_image,
              name_ru: element.name_ru,
              name_en: element.name_en,
              name_tm: element.name_tm,
              description_tm: element.description_tm,
              description_ru: element.description_ru,
              description_en: element.description_en,
              category: element.category.name_ru,
              brand: element.brand.name,
            });
          });
          setDataSource(data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    axiosInstance
      .get(`admin/product/list?search=${searchValue}`)
      .then((res) => {
        res?.data.data.forEach((element) => {
          element.key = element._id;
          element.category = element.category.name_ru;
          element.brand = element.brand.name;
        });
        setDataSource(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [searchValue]);

  return (
    <>
      <Modal
        title="Maglumatlaryňyzy giriziň"
        open={addOpen}
        onOk={handleAddOk}
        confirmLoading={confirmLoading}
        footer={false}
        onCancel={handleAddCancel}
        cancelText={"Çykmak"}
        okText={"Girizmek"}
        width={"800px"}
        okType={"primary"}
        style={{ top: "20px", bottom: "0px" }}
      >
        <form onSubmit={handleAddOk}>
          <div className="banner-add-container">
            <div className="add-left">
              <div className="add-column">Ady (rusça.):</div>
              <div className="add-column">Ady (türkmençe.):</div>
              <div className="add-column">Ady (Eng.):</div>
              <div className="add-column">Kategoriýa:</div>
              <div className="add-column">Markasy:</div>
              <div className="add-column">Bahasy</div>
              <div className="add-picture">Esasy surat</div>
              <div className="add-textarea">
                Giňişleýin maglumatlar (rusça.):
              </div>
              <div className="add-textarea">
                Giňişleýin maglumatlar (türkmençe.):
              </div>
              <div className="add-textarea">Giňişleýin maglumatlar (Eng.):</div>
            </div>
            <div className="add-right">
              <div className="add-column">
                <Input
                  required
                  value={newItem?.name_ru}
                  name="name_ru"
                  placeholder="Ady (rusça.)"
                  onChange={handleAddChange}
                />
              </div>
              <div className="add-column">
                <Input
                  required
                  name="name_tm"
                  placeholder="Ady (türkmen.)"
                  value={newItem?.name_tm}
                  onChange={handleAddChange}
                />
              </div>
              <div className="add-column">
                <Input
                  required
                  name="name_en"
                  placeholder="Ady (Eng.)"
                  value={newItem?.name_en}
                  onChange={handleAddChange}
                />
              </div>
              <div className="add-column">
                <Select
                  value={newItemCategory}
                  showSearch
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Kategoriýany saýlaň"
                  onChange={(e) => handleUpdateSelectChange(e)}
                  options={selectOptions}
                />
              </div>
              <div className="add-column">
                <Select
                  value={newItemBrand}
                  showSearch
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Markany saýlaň"
                  onChange={(e) => handleBrandChange(e)}
                  options={brandOptions}
                />
              </div>
              <div className="add-column">
                <Input
                  required
                  name="price"
                  placeholder="Bahasy"
                  value={newItem?.price}
                  onChange={handleAddChange}
                />
              </div>
              <div className="add-picture">
                {newItem?._id && (
                  <img
                    className="category-image-edit"
                    src={"http://127.0.0.1:5000/" + newItem?.main_image}
                    alt={newItem?.name_ru}
                  />
                )}
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
              <div className="add-textarea">
                <Input.TextArea
                  required
                  rows={7}
                  name="description_ru"
                  placeholder="Giňişleýin maglumat (rusça.)"
                  value={newItem?.description_ru}
                  onChange={handleAddChange}
                />
              </div>
              <div className="add-textarea">
                <Input.TextArea
                  required
                  rows={7}
                  name="description_tm"
                  placeholder="Giňişleýin maglumat (türkmençe.)"
                  value={newItem?.description_tm}
                  onChange={handleAddChange}
                />
              </div>
              <div className="add-textarea">
                <Input.TextArea
                  required
                  rows={7}
                  name="description_en"
                  placeholder="Giňişleýin maglumat (Eng.)"
                  value={newItem?.description_en}
                  onChange={handleAddChange}
                />
              </div>
            </div>
          </div>
          <div className="admin-footer">
            <button className="footer-cancel" onClick={handleAddCancel}>
              Çykmak
            </button>
            <button className="footer-ok" onClick={handleAddOk}>
              Girizmek
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Siz hakykatdanam pozmakçymy?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{ danger: true }}
        cancelText={"Ýok"}
        okText={"Howwa"}
        okType={"primary"}
        style={{
          top: "200px",
        }}
      />
      <div className="page">
        <div className="page-header-content">
          <h2 className="admin-section-name">{`Harytlar`}</h2>
          <div className="add-button" onClick={showAddModal}>
            Girizmek
          </div>
        </div>
        <div className="subcategories-header-filters"></div>
        <TableComponent
          active={selectedItem?._id}
          columns={columns}
          dataSource={dataSource}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default Products;
