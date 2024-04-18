import { useContext } from "react";
import { SebedimContext } from "../../context/context";
import BannerSlider from "./components/BannerSlider";
import image1 from "../../images/1.webp";
import image2 from "../../images/2.webp";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [banners, setBanners] = useState(null);
  const navigate = useNavigate();

  const { sebedim, Increment, Decrement, AddTo } = useContext(SebedimContext);

  const handleAdd = (id, name, price, image) => {
    AddTo(id, name, price, image);
  };

  useEffect(() => {
    axiosInstance
      .get("/product/list")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
    axiosInstance
      .get("/category/list")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.log(err));
    axiosInstance
      .get("/banner/list")
      .then((res) => setBanners(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  const handleCategoryClick = (item) => {
    navigate(`/category/${item._id}`);
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item._id}`);
  };

  return (
    <>
      <div>
        <BannerSlider slides={banners} />
      </div>
      <div className="content">
        <div className="mt-[50px] flex justify-between">
          <h2 className="text-[24px] font-[600]">Tehnologiýalaryň görnüşi</h2>
          <h2 className="text-[#b7b7b7] text-[20px]">Ählisi</h2>
        </div>
        <div className="grid grid-cols-5 gap-[15px]">
          {categories?.map((item) => (
            <div
              className="group border-[1px] rounded-[20px] p-[20px] mt-[20px] bg-[#fafafa] cursor-pointer"
              onClick={() => handleCategoryClick(item)}
            >
              <div className="w-full h-[100px]">
                <img
                  className="group-hover:scale-105 transition-all duration-100 w-full h-full object-cover"
                  src={"http://127.0.0.1:5000/" + item.image}
                  alt="asd"
                />
              </div>
              <h2 className="font-[500] text-[0.9rem] mt-[10px]">
                {item.name_tm}
              </h2>
            </div>
          ))}
        </div>
        <div className="mt-[50px] flex justify-between">
          <h2 className="text-[24px] font-[600]">Tehnologiýalar</h2>
          <h2 className="text-[#b7b7b7] text-[20px]">Ählisi</h2>
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
                  handleAdd(item._id, item.name_tm, item.price, item.main_image)
                }
              >
                Satyn almak
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
