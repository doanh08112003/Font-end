import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { BsFillBoxSeamFill, BsShopWindow } from 'react-icons/bs';
import { RiBillLine } from 'react-icons/ri';
import { FaBuffer, FaUserFriends, FaTag } from 'react-icons/fa';
import { SiZerodha } from 'react-icons/si';
import { AiOutlineBgColors } from 'react-icons/ai';
import { SiSteelseries } from 'react-icons/si';
import { MdGroupWork, MdArchitecture } from 'react-icons/md';
import { TbLayoutDashboard, TbPackages } from 'react-icons/tb';

function MenuAdmin() {
  const [openKeys, setOpenKeys] = useState([]); // State để mở các submenu

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  // Function để tạo các item trong menu
  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  // Cấu hình các item trong menu
  const items = [
    getItem(
      <Link to="/admin/dashboard">Dashboard</Link>,
      '1',
      <TbLayoutDashboard />
    ),
    getItem(
      'Quản lý sản phẩm', 'sub1', <BsFillBoxSeamFill />, [
      getItem(<Link to="/products">Sản phẩm</Link>, '2', <BsFillBoxSeamFill />),
      getItem(
        <Link to="/products/detail">Sản phẩm chi tiết</Link>,
        '3',
        <TbPackages />
      ),

    ]
    ), getItem('Thuộc tính', 'sub10', <FaBuffer />, [
      getItem(<Link to="/chatlieu">Chất liệu</Link>, '4', <SiSteelseries />),
      getItem(<Link to="/nhomsanpham">Loại sản  phẩm</Link>, '5', <MdGroupWork />),
      getItem(<Link to="/mui">Mũi giày</Link>, '6', <MdArchitecture />),
      getItem(<Link to="/de">Đế giày</Link>, '9', <MdArchitecture />),
      getItem(<Link to="/mausac">Màu sắc</Link>, '7', <AiOutlineBgColors />),
      getItem(<Link to="/kichthuoc">Kích thước</Link>, '8', <SiZerodha />),
    ]),
    getItem(<Link to="/nguoidung">Quản lý người dùng</Link>, '63', <FaUserFriends />),
    getItem(<Link to="/hoadon">Quản lý hóa đơn</Link>, '9', <RiBillLine />),
    getItem(<Link to="/bantaiquay">Bán hàng tại quầy</Link>, '62', <BsShopWindow />),
    getItem('Giảm giá', 'sub5', <FaTag />,
      [
        getItem(
          <Link to="/promotion">Sản phẩm đợt giảm giá</Link>, '67', <TbPackages />
        ),
        getItem(<Link to="/phieugiamgia">Quản lý phiếu giảm giá</Link>, '69', <i className="fa-solid fa-ticket"></i>),

      ]
    ),
  ];

  return (
    <div className="menu-container">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{ width: '100%', height: '100vh' }}
      >
        {items.map(item => (
          item.children ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map(child => (
                <Menu.Item key={child.key} icon={child.icon}>
                  {child.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          )
        ))}
      </Menu>
    </div>
  );
}

export default MenuAdmin;
