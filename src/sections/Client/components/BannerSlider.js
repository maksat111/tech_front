import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SimpleSlider({ slides }) {
  var settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      {slides?.map((item) => (
        <div className="h-[75vh]">
          <img
            className="w-full h-full object-cover"
            src={"http://127.0.0.1:5000/" + item.image}
          />
        </div>
      ))}
    </Slider>
  );
}
