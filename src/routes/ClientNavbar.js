import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../sections/Client/components/Navbar";
import Footer from "../sections/Client/components/Footer";
import { useState } from "react";
import { axiosInstance } from "../config/axios";
import { useContext } from "react";
import { SebedimContext } from "../context/context";
import { AiOutlineArrowLeft } from "react-icons/ai";

const NavbarOutlet = () => {
  const { sebedim, Increment, Decrement, AddTo } = useContext(SebedimContext);
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();

  const searchPress = (item) => {
    axiosInstance
      .get(`/product/list?search=${item}`)
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const handleAdd = (id, name, price, image) => {
    AddTo(id, name, price, image);
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item._id}`);
    setProducts(null);
  };

  const handleBack = () => {
    navigate("/");
    setProducts(null);
  };

  return (
    <>
      <Navbar searchPress={searchPress} />
      {!products && <Outlet />}
      {products && products.length == 0 && (
        <div className="h-[calc(100vh-550px)]">
          <h2 className="text-center text-[25px] my-[20px]">
            Sizin gözleýän harydyňyz tapylmady
          </h2>
          <div
            className="text-center text-[18px] duration-300 hover:bg-[#4eb060] text-[#4eb060] bg-[#ecf7ee] w-fit mx-auto hover:text-white py-[7px] px-[15px] rounded-[7px] cursor-pointer"
            onClick={handleBack}
          >
            Yza dolanmak
          </div>
        </div>
      )}
      {products && products.length > 0 && (
        <div className="content">
          <div
            className="flex items-center gap-[10px] text-center text-[18px] duration-300 hover:bg-[#4eb060] text-[#4eb060] bg-[#ecf7ee] w-fit hover:text-white py-[7px] px-[15px] rounded-[7px] cursor-pointer mt-[15px]"
            onClick={handleBack}
          >
            <AiOutlineArrowLeft />
            Yza dolanmak
          </div>
          <div className="grid grid-cols-3 gap-[25px]">
            {products?.map((item) => (
              <div
                className="border-[1px] rounded-[20px] p-[20px] mt-[20px] cursor-pointer"
                onClick={() => handleProductClick(item)}
              >
                <div className="w-full h-[180px]">
                  <img
                    className="w-full h-full object-cover"
                    src={"http://127.0.0.1:5000/" + item.main_image}
                    alt="asd"
                  />
                </div>
                <h2 className="font-[500] text-[18px] mt-[10px]">
                  {item.name_tm}
                </h2>
                <h2 className="font-[500] mt-[5px] text-[1.4rem] text-[#393939]">
                  {item.price} TMT
                </h2>
                <div
                  className="mx-auto w-[90%] flex justify-center items-center rounded-[25px] mt-[10px] h-[50px] bg-[#ecf7ee] hover:bg-[#4eb060] text-[#4eb060] hover:text-[white] cursor-pointer duration-300"
                  onClick={() =>
                    handleAdd(
                      item._id,
                      item.name_tm,
                      item.price,
                      item.main_image
                    )
                  }
                >
                  Satyn almak
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default NavbarOutlet;
