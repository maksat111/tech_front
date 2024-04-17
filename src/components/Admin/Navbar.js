import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import logo from "../../images/logo.webp";
import "./Navbar.css";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/getToken";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("computershop-admin"));
    setProfileName(data?.name + " " + data?.surname);
  }, []);

  const userStyle = { fontSize: "24px" };
  const logoutStyle = { transform: "rotate(180deg)" };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    localStorage.removeItem("computershop-admin");
    navigate("/admin");
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Siz hakykatdanam çykmak isleýaňizmi?"
        open={open}
        onOk={handleOk}
        okText={"Да"}
        cancelText={"Нет"}
        okButtonProps={{ danger: true }}
        onCancel={handleCancel}
        style={{
          top: "200px",
        }}
      />

      <div className="navbar-container">
        <div className="flex items-center gap-[15px]">
          <img src={logo} alt="turkmenExpress" />
          <p className="text-white uppercase text-[18px] font-[500]">
            Türkmenistanyň Oguz han adyndaky Inžener-tehnologiýalar uniwersiteti
          </p>
        </div>
        <div className="navbar-items">
          <div className="navbar-user-item">
            <AiOutlineUser style={userStyle} />
            <p>{profileName}</p>
          </div>
          <div className="navbar-logout" onClick={showModal}>
            <FiLogOut style={logoutStyle} />
            Çykmak
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
