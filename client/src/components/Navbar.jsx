import React, { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md'; // 导入语言图标

import logo from "../../images/logo.png";

const NavBarItem = ({ title, classprops }) => {
  return (
    <li className={`mx-4 cursor-pointer ${classprops}`}>
      {title}
    </li>
  );
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { t, i18n } = useTranslation(); // 添加 i18n

  // 添加语言切换函数
  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  const menuItems = [
    t('navbar.market'),
    t('navbar.exchange'),
    t('navbar.tutorials'),
    t('navbar.wallets')
  ];

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {menuItems.map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}
        {/* 添加语言切换按钮 */}
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] flex items-center"
            onClick={toggleLanguage}>
          <MdLanguage className="mr-2" />
          {i18n.language === 'zh' ? 'EN' : '中文'}
        </li>
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          {t('navbar.login')}
        </li>
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
            {menuItems.map((item, index) => (
              <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />
            ))}
            {/* 在移动端菜单中也添加语言切换按钮 */}
            <li className="my-2 text-lg cursor-pointer flex items-center" onClick={toggleLanguage}>
              <MdLanguage className="mr-2" />
              {i18n.language === 'zh' ? 'Switch to English' : '切换到中文'}
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;