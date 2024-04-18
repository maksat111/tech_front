import React, { useState, useContext, useEffect } from "react";
import { axiosInstance } from "../../config/axios";
import { SebedimContext } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetail = () => {
  const { sebedim, Increment, Decrement, AddTo } = useContext(SebedimContext);
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const handleAdd = (id, name, price, image) => {
    AddTo(id, name, price, image);
  };

  useEffect(() => {
    axiosInstance
      .get(`/product/${id}`)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  const handleProductClick = (item) => {
    navigate(item._id);
  };

  const onCategoryClick = () => {
    navigate(`/category/${products?.category._id}`);
  };

  const onMainClick = () => {
    navigate(`/`);
  };

  return (
    <div className="content">
      {/* start */}
      <div className="flex gap-[5px] my-[25px] text-[23px]">
        <p className="cursor-pointer" onClick={onMainClick}>
          Esasy sahypa
        </p>
        <p>/</p>
        <p className="cursor-pointer" onClick={onCategoryClick}>
          {products?.category.name_tm}
        </p>
        <p>/</p>
        <p className="cursor-pointer">{products?.name_tm}</p>
      </div>
      {/* end */}
      <div className="grid grid-cols-2 gap-[30px]">
        <div className="mx-auto w-full h-auto rounded-[10px]">
          <img
            className="rounded-[10px]"
            src={"http://127.0.0.1:5000/" + products?.main_image}
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <p className="text-[20px]">Harydyň ady: {products?.name_tm}</p>
          <p className="text-[20px]">
            Kategoriýasy: {products?.category.name_tm}
          </p>
          <p className="text-[20px]">Markasy: {products?.brand.name}</p>
          <p className="text-[20px]">Markasy: {products?.brand.name}</p>
          <p className="text-[20px]">
            Giňişleýin maglumat: {products?.description_tm}
          </p>
          <div className="flex gap-[25px]">
            <div className="mx-auto w-[90%] flex justify-center items-center rounded-[25px] mt-[10px] h-[50px] bg-[#f1efe0]  text-[#f7c500] cursor-pointer">
              Bahasy: {products?.price} manat
            </div>
            <div
              className="mx-auto w-[90%] flex justify-center items-center rounded-[25px] mt-[10px] h-[50px] bg-[#ecf7ee] hover:bg-[#4eb060] text-[#4eb060] hover:text-[white] cursor-pointer duration-300"
              onClick={() =>
                handleAdd(
                  products._id,
                  products.name_tm,
                  products.price,
                  products.main_image
                )
              }
            >
              Satyn almak
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
