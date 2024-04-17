import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.webp";

function Footer(props) {
  const [year, setYear] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

  const sections = [
    {
      text_en: "Esasy",
      href: "/",
    },
    {
      text_en: "Düzgünler",
      href: "/rules",
    },
    {
      text_en: "Habarlaşmak",
      href: "/contact",
    },
    {
      text_en: "Biz barada",
      href: "/about",
    },
  ];
  return (
    <div className="print:hidden bg-[#146cda] mt-[50px] h-[425px] sm:h-[530px] md:h-[420px] flex justify-center items-center px-[15px] sm:px-[20px] md:px-[40px] lg:pl-[70px] lg:pr-[50px]">
      <div className="max-w-[1244px] w-full h-full">
        <img
          className="hidden sm:inline max-w-[105px] w-full max-h-[95px] h-full mt-[50px] cursor-pointer select-none"
          onClick={() => navigate("/")}
          src={logo}
          alt=""
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px] mt-[30px]">
          <div className="hidden md:inline sm:col-span-2">
            <div className="flex flex-col gap-[10px] cursor-pointer select-none w-fit">
              {sections.map((item, index) => (
                <p
                  key={index}
                  className="font-[400] text-[14px] text-white leading-[21px] tracking-[0.7px] transition hover:text-white"
                  onClick={() => navigate(item.href)}
                >
                  {item.text_en}
                </p>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <p className="font-[500] text-[16px] leading-[24px] text-white tracking-[0.7px] cursor-pointer">
              Contact us
            </p>
            <p
              className="text-[14px] leading-[22px] text-white font-[300] mt-[10px] tracking-[0.7px] cursor-pointer max-w-[305px]"
              onClick={() => navigate("/contact")}
            >
              100 Taslama Köçe, Aşgabat şäher, Türkmenistan
            </p>
            <p className="font-[400] text-[16px] leading-[24px] text-white tracking-[0.7px] mt-[40px] cursor-default">
              Phone
            </p>
            <a
              className="text-[14px] leading-[22px] text-white font-[300] mt-[10px] tracking-[0.7px] cursor-pointer"
              href="tel:"
            >
              +993 6* ** ** **
            </a>
          </div>
        </div>
        <div className="flex flex-col-reverse md:grid md:grid-cols-4 gap-[50px] md:gap-[14px] mt-[30px]">
          <div className="col-span-2">
            <p className="text-[#ffffff] font-[400] text-[14px] tracking-[0.7px]">
              Copyright All Rights Reserved {year}
            </p>
            <p className="text-white font-[400] text-[14px] tracking-[0.7px] mt-[10px] elading-[21px]">
              Designed by
              <a
                className="text-white cursor-pointer ml-[5px]"
                target="_blank"
                href="https://etut.edu.tm/"
              >
                TITU
              </a>
            </p>
          </div>
          <div className="col-span-2">
            <p className="font-[400] text-[16px] leading-[24px] text-white tracking-[0.7px] cursor-default">
              E-mail
            </p>
            <a
              className="text-[14px] leading-[22px] text-white font-[300] mt-[10px] cursor-pointer"
              href="mailto:oguzhan.edu.tm@gmail.com"
            >
              oguzhan.edu.tm@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
