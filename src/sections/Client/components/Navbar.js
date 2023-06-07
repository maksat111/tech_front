import React, { useState } from 'react';
import { Select, Badge } from 'antd';
import logo from '../../../images/logo.svg';
import { BsSearch } from 'react-icons/bs';
import { SlUser } from 'react-icons/sl';
import { AiOutlineHeart, AiOutlineUnorderedList } from 'react-icons/ai';
import { FiShoppingBag } from 'react-icons/fi';
import turkmen from '../../../images/turkmen.png';
import russian from '../../../images/russian.png';
import english from '../../../images/english.png';

function Navbar(props) {
    const [active, setActive] = useState(1);
    const [language, setLanguage] = useState({
        value: 'English',
        label: 'English',
        icon: english,
        code: 'en',
    });
    const items = [
        {
            id: 1,
            text_tm: 'Esasy',
            text_en: 'Home'
        },
        {
            id: 2,
            text_tm: 'Düzgünler',
            text_en: 'Terms & Conditions'
        },
        {
            id: 3,
            text_tm: 'Habarlaşmak',
            text_en: 'Contact Us'
        },
        {
            id: 4,
            text_tm: 'Biz barada',
            text_en: 'About Us'
        },
    ]
    const categoryOption = [
        {
            value: 'All Categories',
            label: 'All Categories',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'Yiminghe',
            label: 'yiminghe',
        },
    ];

    const languageOption = [
        {
            value: 'English',
            label: 'English',
            icon: english,
            code: 'en',
        },
        {
            value: 'Türkmençe',
            label: 'Türkmençe',
            icon: turkmen,
            code: 'tm',
        },
        {
            value: 'Русский',
            label: 'Русский',
            icon: russian,
            code: 'ru'
        },
    ]

    const handleClick = (item) => {
        setActive(item);
    }

    const handleLanguageChange = (e) => {
        const founded = languageOption.find(item => item.value == e);
        setLanguage(founded)
    }

    return (
        <>
            <div className='bg-[#146cda] w-[100vw] flex items-center'>
                <div className='py-[33px] flex flex-row justify-between px-[20px] max-w-[1410px] w-[100%] gap-[10px] mx-auto'>
                    <img className='h-[40px]' src={logo} alt='logo' />
                    <div className='flex flex-row bg-white rounded-[7px] items-center w-[55%]'>
                        <div className='bg-gray-100 rounded-l-[7px]'>
                            <Select
                                placeholder={'All categories'}
                                className='flex items-center '
                                defaultValue='All Categories'
                                style={{
                                    height: 45,
                                    width: 135,
                                }}
                                bordered={false}
                                options={categoryOption}
                            />
                        </div>
                        <div className='px-[10px] py-[5px] w-[100%]'>
                            <input className='placeholder:text-sm w-[100%] outline-none' type='text' placeholder='Search entire here' />
                        </div>
                        <div className='bg-[#1d1d1d] text-white hover:text-[#146cda] cursor-pointer h-full flex items-center rounded-r-[7px] px-[20px]'>
                            <BsSearch className=' text-[18px]' />
                        </div>
                    </div>
                    <div className='flex gap-[25px]'>
                        <div className='flex items-center text-[25px] text-white hover:text-black cursor-pointer'>
                            <SlUser />
                        </div>
                        <div className='flex items-center text-[27px] text-white hover:text-black cursor-pointer'>
                            <Badge count={5} offset={[0, 25]} size='small' className='flex items-center text-[30px] text-white hover:text-black cursor-pointer' showZero color={'white'}>
                                <AiOutlineHeart />
                            </Badge>
                        </div>
                        <div className='flex items-center text-[15px] gap-[10px] text-white font-[700]'>
                            <Badge count={5} offset={[0, 24]} size='small' className='flex items-center text-[27px] text-white hover:text-black cursor-pointer' showZero color={'white'}>
                                <FiShoppingBag />
                            </Badge>
                        300TMT
                    </div>
                    </div>
                </div>
            </div>
            <div className='w-[100vw] flex items-center shadow'>
                <div className='flex flex-row justify-between px-[20px] max-w-[1410px] w-[100%] gap-[10px] mx-auto'>
                    <div className='flex gap-[25px] items-center'>
                        <div className='flex gap-[2px] items-center'>
                            <AiOutlineUnorderedList className='text-black text-[20px]' />
                            <Select
                                placeholder={'All categories'}
                                className='flex items-center'
                                defaultValue='All Categories'
                                style={{
                                    height: 45,
                                    width: 135,
                                    fontSize: 20
                                }}
                                bordered={false}
                                options={categoryOption}
                            />
                        </div>
                        {items.map(item => <p
                            key={item.id}
                            className={`${active == item.id ? 'text-[#146CDA]' : 'text-black'} cursor-pointer hover:text-[#146CDA]`}
                            onClick={() => handleClick(item.id)}>{item.text_en}
                        </p>)}
                    </div>
                    <div className='flex items-center gap-[2px]'>
                        <img className='h-[22px]' src={language.icon} />
                        <Select
                            className='flex items-center text-[20px]'
                            defaultValue='English'
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
        </>
    );
}

export default Navbar;