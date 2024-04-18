import React, { useState, useContext, useEffect } from "react";
import { axiosInstance } from "../../config/axios";
import { SebedimContext } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";

const CategoryDetails = () => {
  const { sebedim, Increment, Decrement, AddTo } = useContext(SebedimContext);
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const handleAdd = (id, name, price, image) => {
    AddTo(id, name, price, image);
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item._id}`);
  };

  useEffect(() => {
    axiosInstance
      .get(`/category/${id}`)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="content">
      <h2 className="text-center text-[25px] font-[500] my-[10px]">
        {products && products[0]?.category.name_tm}
      </h2>
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
            <h2 className="font-[500] text-[18px] mt-[10px]">{item.name_tm}</h2>
            <h2 className="font-[500] mt-[5px] text-[1.4rem] text-[#393939]">
              {item.price} TMT
            </h2>
            <div
              className="mx-auto w-[90%] flex justify-center items-center rounded-[25px] mt-[10px] h-[50px] bg-[#ecf7ee] hover:bg-[#4eb060] text-[#4eb060] hover:text-[white] cursor-pointer duration-300"
              onClick={() =>
                handleAdd(item._id, item.name_tm, item.price, item.main_image)
              }
            >
              Satyn almak
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetails;
