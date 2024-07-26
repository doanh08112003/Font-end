import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Select, Checkbox, Table, Tooltip, notification, DatePicker } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

function ModalA({ onActionSuccess }) {
    const navigate = useNavigate();
    const [tensanpham, setTensanpham] = useState([]);
    const [sanPhamChiTiet, setSanPhamChiTiet] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loaiGiam, setLoaiGiam] = useState('');
    const [ten, setTen] = useState('');
    const [mucGiam, setMucGiamGia] = useState('');
    const [ngayBatDau, setNgayBatDau] = useState(null);
    const [ngayKetThuc, setNgayKetThuc] = useState(null);
    const [selectedSanPham, setSelectedSanPham] = useState(null);

    const fetchSanPham = async () => {
        try {
            const response = await axios.get('http://localhost:8080/sanpham/laydanhsach');
            const data = response.data.map(sanpham => ({
                value: sanpham.id,
                label: sanpham.tensanpham,
            }));
            setTensanpham(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchSanPham();
    }, []);

    const handleSanPhamChange = async (value) => {
        setSelectedSanPham(value);
        console.log(value)
        try {
            const response = await axios.get(`http://localhost:8080/chitietsanpham/sp/${value}`);
            setSanPhamChiTiet(response.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handleClick = () => {

        const DotGiamGia = { ten, mucGiam, loaiGiam, ngayBatDau, ngayKetThuc, selectedSanPham };
        axios.post('http://localhost:8080', { selectedIds }).then(() => {
            axios.post('http://localhost:8080/dot-giam-gia/add', DotGiamGia)
                .then(() => {
                    if (typeof onActionSuccess === 'function') {
                        onActionSuccess();
                    }
                    openNotification('success', 'Hệ thống', 'Thêm thành công', 'bottomRight');
                    setIsModalOpen(false);
                    navigate('/promotion'); // Quay về trang đầu sau khi thêm
                })
                .catch((error) => {
                    console.error('Error adding discount:', error);
                    openNotification('error', 'Lỗi', 'Thêm thất bại', 'bottomRight');
                });
        })

    };

    const handleCheckboxChange = (id, checked) => {
        if (checked) {
            setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);

        } else {
            setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((itemId) => itemId !== id));
        }
        console.log(selectedIds + "id lis")
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const disabledDate = (current) => {
        // Disable dates before today and today itself
        return current && current < moment().startOf('day');
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'tensanpham',
            key: 'tensanpham',

            render: (text, record) => record.sanpham?.tensanpham + " [" + record.mausac?.ten + '-' + record.kichco?.ten + "]" || '',
        },
        {
            title: 'Số lượng',
            dataIndex: 'soluong',
            key: 'soluong',

            editable: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngaytao',
            key: 'ngaytao',
        },
        {
            title: 'Khối lượng',
            dataIndex: 'khoiluong',
            key: 'khoiluong',
            editable: true,
        },
        {
            title: 'Giá trị',
            dataIndex: 'gia',
            key: 'gia',
            editable: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangthai',
            key: 'trangthai',
            filters: [
                { text: 'ĐangBán', value: 'Chờ' },
                { text: 'Ngưng', value: 'Ngưng' },
            ],
            onFilter: (value, record) => record.trangthai.includes(value),
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            render: (_, record) => (
                <Checkbox onChange={(e) => handleCheckboxChange(record.id, e.target.checked)} />
            ),
        },
    ];
    const openNotification = (type, title, des, placement) => {
        notification[type]({
            message: title,
            description: des,
            placement,
        });
    };
    // const handleSubmit = async () => {
    //     try {
    //         await axios.post('http://localhost:8080/dotgiam', { selectedIds });

    //         setIsModalOpen(false);
    //         setSelectedIds([]);
    //         if (typeof onActionSuccess === 'function') {
    //             onActionSuccess();
    //         }
    //     } catch (error) {
    //         console.error('Error saving data:', error);
    //     }
    // };
    return (
        <>
            <div style={{ marginLeft: '4px', marginRight: '4px' }}>
                {/* <Tooltip title="ADD">
                    <Button type="primary" onClick={showModal}>Thêm dữ liệu</Button>
                </Tooltip> */}
                <Form
                    width={1500}
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    title="Thêm Đợt Mới"
                    visible={isModalOpen}
                    onCancel={handleCancel}
                    style={{ backgroundColor: '#FFFFFF', padding: '16px', color: '#fff' }}

                    // onOk={handleSubmit}
                    centered
                >
                    <div style={{ display: 'flex' }}>
                        <Form layout="vertical" style={{ flex: '0 0 50%' }}>
                            <Form.Item
                                label="Tên đợt giảm"
                                name="Tên đợt giảm"
                                rules={[{ required: true, message: 'Vui lòng nhập tên đợt giảm' }]}
                            >
                                <Input value={ten} onChange={(e) => setTen(e.target.value)} />
                            </Form.Item>
                            <Form.Item
                                label="Loại giảm"
                                name="Loại giảm"
                                rules={[{ required: true, message: 'Vui lòng chọn loại giảm' }]}
                            >
                                <Select value={loaiGiam} onChange={(value) => setLoaiGiam(value)}>
                                    <Option value="PHAN_TRAM">Phần trăm</Option>
                                    <Option value="TIEN_MAT">Giảm thẳng</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Giá trị giảm"
                                name="Giá trị giảm"
                                rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
                            >
                                <Input value={mucGiam} onChange={(e) => setMucGiamGia(e.target.value)} />
                            </Form.Item>
                            <Form.Item
                                label="Ngày bắt đầu"
                                name="Ngày bắt đầu"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value || moment(value).isSameOrAfter(moment(), 'day')) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Ngày bắt đầu không được trước hôm nay'));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledDate}
                                    value={ngayBatDau ? moment(ngayBatDau) : null}
                                    onChange={(date) => setNgayBatDau(date)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ngày kết thúc"
                                name="Ngày kết thúc"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập ngày kết thúc' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || value.isAfter(getFieldValue('ngayBatDau'), 'day')) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    value={ngayKetThuc}
                                    onChange={(date) => setNgayKetThuc(date)}
                                    disabledDate={(current) => current && current < moment().startOf('day')}

                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" onClick={handleClick}>Thêm</Button>
                            </Form.Item>
                        </Form>

                        <div style={{ flex: '1', marginLeft: "17px" }}>
                            <Form.Item
                                label="Tên sản phẩm"
                                name="Tên sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng chọn tên sản phẩm' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn tên sản phẩm"
                                    optionFilterProp="children"
                                    value={selectedSanPham}
                                    onChange={handleSanPhamChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {tensanpham.map((item) => (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>



                            <Table
                                dataSource={sanPhamChiTiet}
                                columns={columns}
                                pagination={{ pageSize: 4 }}
                                rowKey={(record) => record.id}
                            />
                        </div>
                    </div>

                </Form>
            </div>
        </>
    );
}

export default ModalA;
