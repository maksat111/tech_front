import React, { useState, useContext, useEffect } from "react";
import { Select, Badge, Drawer } from "antd";
import { SebedimContext } from "../../../context/context";
import logo from "../../../images/logo.webp";
import { BsSearch } from "react-icons/bs";
import { SlUser } from "react-icons/sl";
import {
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineDelete,
} from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";
import turkmen from "../../../images/turkmen.png";
import russian from "../../../images/russian.png";
import english from "../../../images/english.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ searchPress }) {
  const [active, setActive] = useState(1);
  const [value, setValue] = useState("");
  const { sebedim, Increment, Decrement, Remove } = useContext(SebedimContext);
  const [numberProduct, setNumberProduct] = useState(0);
  const [total, setTotal] = useState({});
  const [language, setLanguage] = useState({
    value: "English",
    label: "English",
    icon: turkmen,
    code: "en",
  });

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleIncrease = (id, sany) => {
    Increment(id, sany);
  };
  const handleRemove = (id) => {
    Remove(id);
  };
  const handleDecrease = (id, sany) => {
    Decrement(id, sany);
  };

  const navigate = useNavigate();

  const items = [
    {
      id: 1,
      text_tm: "Esasy",
      text_en: "Home",
      href: "/",
    },
    {
      id: 2,
      text_tm: "Düzgünler",
      text_en: "Terms & Conditions",
    },
    {
      id: 3,
      text_tm: "Habarlaşmak",
      text_en: "Contact Us",
    },
    {
      id: 4,
      text_tm: "Biz barada",
      text_en: "About Us",
    },
  ];
  const categoryOption = [
    {
      value: "Ähli kategoriýalar",
      label: "Ähli kategoriýalar",
    },
    {
      value: "Kompýuter tehnologiýalary",
      label: "Kompýuter tehnologiýalary",
    },
  ];

  const languageOption = [
    {
      value: "English",
      label: "English",
      icon: english,
      code: "en",
    },
    {
      value: "Türkmençe",
      label: "Türkmençe",
      icon: turkmen,
      code: "tm",
    },
    {
      value: "Русский",
      label: "Русский",
      icon: russian,
      code: "ru",
    },
  ];

  const handleClick = (item) => {
    setActive(item.id);
    navigate(item.href);
  };

  const handleLanguageChange = (e) => {
    const founded = languageOption.find((item) => item.value == e);
    setLanguage(founded);
  };

  useEffect(() => {
    let a = 0;
    let b = 0;
    sebedim?.forEach((element) => {
      a = a + element.sany;
      b = b + element.baha * element.sany;
    });
    setTotal({ baha: b, sany: a });
  }, [sebedim]);

  // const baha = sebedim[0] ? sebedim[0].baha.split(" ") : [0];
  // const jemi = sebedim[0]?.sany * baha[0];

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearchClick = () => {
    searchPress(value);
  };

  return (
    <>
      <div className="bg-[#146cda] w-[100vw] flex items-center">
        <div className="py-[15px] flex flex-row justify-between items-center px-[20px] max-w-[1410px] w-[100%] gap-[10px] mx-auto">
          <img className="h-[80px]" src={logo} alt="logo" />
          <div className="flex flex-row bg-white rounded-[7px] items-center w-[55%] h-[50px]">
            <div className="bg-gray-100 rounded-l-[7px]">
              <Select
                placeholder={"Ähli kategoriýalar"}
                className="flex items-center "
                defaultValue="Ähli kategoriýalar"
                style={{
                  height: 45,
                  width: 155,
                }}
                bordered={false}
                options={categoryOption}
              />
            </div>
            <div className="px-[10px] py-[5px] w-[100%]">
              <input
                value={value}
                onChange={handleChange}
                className="placeholder:text-sm w-[100%] outline-none"
                type="text"
                placeholder="Search entire here"
              />
            </div>
            <div
              className="bg-[#1d1d1d] text-white hover:text-[#146cda] cursor-pointer h-full flex items-center rounded-r-[7px] px-[20px]"
              onClick={handleSearchClick}
            >
              <BsSearch className=" text-[18px]" />
            </div>
          </div>
          <div className="flex gap-[25px]">
            <div className="flex items-center text-[25px] text-white hover:text-black cursor-pointer">
              <SlUser />
            </div>
            <div className="flex items-center text-[27px] text-white hover:text-black cursor-pointer">
              <Badge
                count={5}
                offset={[0, 25]}
                size="small"
                className="flex items-center text-[30px] text-white hover:text-black cursor-pointer"
                showZero
                color={"white"}
              >
                <AiOutlineHeart />
              </Badge>
            </div>

            <div
              className="flex items-center text-[15px] gap-[10px] text-white font-[700]"
              onClick={() => showDrawer()}
            >
              <Badge
                count={total.sany}
                offset={[0, 24]}
                size="small"
                className="flex items-center text-[27px] text-white hover:text-black cursor-pointer"
                showZero
                color={"white"}
              >
                <FiShoppingBag />
              </Badge>
              300TMT
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100vw] flex items-center shadow">
        <div className="flex flex-row justify-between px-[20px] max-w-[1410px] w-[100%] gap-[10px] mx-auto">
          <div className="flex gap-[25px] items-center">
            {/* <div className="flex gap-[2px] items-center">
              <AiOutlineUnorderedList className="text-black text-[20px]" />
              <Select
                placeholder={"Ähli kategoriýalar"}
                className="flex items-center"
                defaultValue="Ähli kategoriýalar"
                style={{
                  height: 45,
                  width: 135,
                  fontSize: 20,
                }}
                bordered={false}
                options={categoryOption}
              />
            </div> */}
            {items.map((item) => (
              <p
                key={item.id}
                className={`${
                  active == item.id ? "text-[#146CDA]" : "text-black"
                } cursor-pointer hover:text-[#146CDA]`}
                onClick={() => handleClick(item)}
              >
                {item.text_tm}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-[2px]">
            <img className="h-[22px]" src={language.icon} />
            <Select
              className="flex items-center text-[20px]"
              defaultValue="Turkmen"
              style={{
                height: 45,
                width: 120,
                fontSize: 25,
              }}
              bordered={false}
              options={languageOption}
              onChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>
      {/* basket */}
      <Drawer
        title={`Sebetdäki harytlar`}
        placement="right"
        size="default"
        onClose={onClose}
        open={open}
      >
        <div className="sebet-container">
          {sebedim?.map((item) => (
            <div className="sebet-card">
              <img src={"http://127.0.0.1:5000/" + item.image} alt="product" />
              <div className="sebet-name-and-product">
                <p className="sebet-product-name">{item.name}</p>
                <p className="sebet-product-price">{item.baha} TMT</p>
              </div>
              <div className="sebet-increaseDecrease">
                <AiOutlineMinus
                  disable
                  className="sebet-increase-decrease-icons"
                  onClick={() => handleDecrease(item._id, 1)}
                />
                {item.sany}
                <AiOutlinePlus
                  className="sebet-increase-decrease-icons"
                  onClick={() => handleIncrease(item._id, 1)}
                />
              </div>
              <div className="delete-icon-container">
                <AiOutlineDelete
                  className="delete-icon"
                  onClick={() => handleRemove(item._id)}
                />
              </div>
            </div>
          ))}
          <div className="sebet-sargyt-button">{total.baha} manat</div>
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
