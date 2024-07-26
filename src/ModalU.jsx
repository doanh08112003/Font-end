import React, { useState, useEffect } from 'react';
// import { Form, Input, Button, Modal, Space, notification } from 'antd';
import { FaRegPenToSquare } from "react-icons/fa6";

import {
    Button,
    Input,
    Modal,
    Tooltip,
    Select,
    notification,
    Space
} from "antd";
import axios from 'axios';
const ModalU = ({ recordId, onActionSuccess }) => {
    // thuong hieu combobox
    const [tenthuonghieu, setTenthuonghieu] = useState([]);
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get('http://localhost:8080/sanpham/laydanhsach');
                setTenthuonghieu(response.data.map(thuonghieu => ({
                    value: thuonghieu.id,
                    label: thuonghieu.tensanpham,
                })));
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchBrands();
    }, []);
    // chatlieu combobox 
    const [tenchatlieu, setTenchatlieu] = useState([]);
    useEffect(() => {
        const fetchchatlieu = async () => {
            try {
                const response = await axios.get('http://localhost:8080/sanpham/laydanhsach');
                setTenchatlieu(response.data.map(thuonghieu => ({
                    value: thuonghieu.id,
                    label: thuonghieu.tensanpham,
                })));
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchchatlieu();
    }, []);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, title, des, placement) => {
        if (type === "error") {
            api.error({
                message: title,
                description: des,
                placement,
            });
        } else {
            api.success({
                message: title,
                description: des,
                placement,
            });
        }
    };
    const [open, setOpen] = useState(false);
    const showModal = () => {
        console.log(recordId);

        setOpen(true);
    };
    const handleOk = async () => {
        // Kiểm tra điều kiện validation
        const validationErrors = validateForm();

        if (validationErrors.length === 0) {
            // Gọi hàm cập nhật với dữ liệu từ state editsanPhamData và recordId
            await updatesanPham(recordId, editsanPhamData);
            onActionSuccess();
            setOpen(false);
        } else {
            // Hiển thị thông báo nếu validation không thành công
            validationErrors.forEach((error) => {
                openNotification("error", "Hệ thống", error, "bottomRight");
            });
        }
    };

    // Hàm kiểm tra validation và trả về mảng chứa các thông báo lỗi
    const validateForm = () => {
        const errors = [];


        if (!editsanPhamData.tensanpham) {
            errors.push("Vui lòng nhập Tên sản phẩm !");
        }
        if (!editsanPhamData.soluong) {
            errors.push("Vui lòng nhập Số lượng!");
        } else if (isNaN(editsanPhamData.soluong) || editsanPhamData.soluong <= 0) {
            errors.push("Số lượng phải là một số dương!");
        }
        return errors;

    };
    const handleCancel = () => {
        setOpen(false);
    };
    const [editsanPhamData, setEditsanPhamData] = useState({
        tensanpham: '',
        soluong: '',

    });

    const updatesanPham = async (id, data) => {
        try {
            await axios.put(`http://localhost:8080/sanpham/updatesanpham/${id}`, data);
            openNotification("success", "Hệ thống", "Sửa thành công", "bottomRight");

        } catch (error) {
            console.error("Error updating sanPham:", error);
        }
    };
    useEffect(() => {
        // Gọi handleClickEdit khi recordId thay đổi
        handleClickEdit(recordId);
    }, [recordId]);


    const handleClickEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/sanpham/${id}`);
            const data = response.data;
            console.log(data)
            console.log("Initial tensanPham value:", data.tensanpham);

            // Cập nhật state để hiển thị dữ liệu trên form
            setEditsanPhamData({
                tensanpham: data.tensanpham,
                soluong: data.soluong,
            });
        } catch (error) {
            console.error(`Error fetching sanPham with id ${id}:`, error);
        }
    };
    return (
        <>{contextHolder}
            <Space>
                <Tooltip title="UPDATe" onClick={showModal}>

                    <Button style={{
                        color: "green",
                    }}
                        shape="circle"
                        icon={<FaRegPenToSquare />}
                        onClick={showModal}>

                    </Button>
                </Tooltip>
            </Space>

            <Modal
                open={open}
                title="Cập nhật sản phẩm ~"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>

                        <CancelBtn />
                        <OkBtn />
                    </>
                )}
            >

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: 'rgb(252, 40, 72)', marginRight: '5px' }}>*</h3>
                    <span style={{ marginRight: '10px' }}>Tên sanPham :</span>
                    <Input
                        style={{ flex: '1' }}
                        size="medium"
                        placeholder="Tên sản phẩm "
                        value={editsanPhamData.tensanpham}
                        onChange={(e) => {
                            setEditsanPhamData({ ...editsanPhamData, tensanpham: e.target.value })
                        }
                        } />
                </div>

                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: 'rgb(252, 40, 72)', marginRight: '5px' }}>*</h3>
                    <span style={{ marginRight: '10px' }}>Giá trị giảm :</span>
                    <Input size="medium" placeholder="Giá trị giảm" style={{ flex: '1' }}
                        value={editsanPhamData.giaTriGiam}
                        onChange={(e) => setEditsanPhamData({ ...editsanPhamData, giaTriGiam: e.target.value })}
                    /></div> */}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: 'rgb(252, 40, 72)', marginRight: '5px' }}>*</h3>
                    <span style={{ marginRight: '10px' }}>Số lượng :</span>
                    <Input size="medium" placeholder="Số lượng"
                        value={editsanPhamData.soluong} style={{ flex: '1' }}
                        onChange={(e) => setEditsanPhamData({ ...editsanPhamData, soluong: e.target.value })}
                    /></div>
                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: 'rgb(252, 40, 72)', marginRight: '5px' }}>*</h3>
                    <span style={{ marginRight: '10px' }}>Thương hiệu ~ :</span>

                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="thương hiệu"
                        optionFilterProp="label"

                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={tenthuonghieu}
                    /></div> */}
                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ color: 'rgb(252, 40, 72)', marginRight: '5px' }}>*</h3>
                    <span style={{ marginRight: '10px' }}>Chất liệu ~ :</span>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="chất liệu"
                        optionFilterProp="label"

                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={tenchatlieu}
                    /></div> */}
            </Modal>
        </>
    );
};
export default ModalU;