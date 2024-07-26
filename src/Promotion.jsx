import React, { useEffect, useState, useRef } from 'react';
import { Input, Table, Button, message, Space, Tag, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
// import ModalA from './AddNewPage';
import ModalD from './ModalD';
import ProductDetail from './ProductDetail';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

export default function Promotion() {
    const searchInput = useRef(null);
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [resetTable, setResetTable] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');  // State for selected status
    const navigate = useNavigate();

    const handleSearch = async (value, status) => {
        setSearchText(value);
        try {
            setLoading(true);
            const result = await axios.get(`http://localhost:8080/timkiem`, {
                params: {
                    keyword: value,
                    status: status
                }
            });
            setSearchResults(result.data);
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);  // Update selected status
    };
    // record.trangThai === value
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
        setSearchedColumn('');
        setResetTable(true);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Search
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 1);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{ backgroundColor: '#ffc069' }}>{text}</span>
            ) : (
                text
            ),
    });
    const handleAddClick = () => {
        navigate('/promotion/add');
    };

    const getStatusProps = (status) => {
        switch (status) {
            case 'SAP_DIEN_RA':
                return { color: 'orange', text: 'Sắp diễn ra' };
            case 'DANG_DIEN_RA':
                return { color: 'blue', text: 'Đang diễn ra' };
            case 'DA_KETTHUC':
                return { color: 'red', text: 'Đã kết thúc' };
            default:
                return { color: 'gray', text: 'Chưa xác định' };
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên đợt giảm',
            dataIndex: 'ten',
            key: 'ten',
            ...getColumnSearchProps('ten'),
        },
        {
            title: 'Giá trị',
            dataIndex: 'mucGiam',
            key: 'mucGiam',
            render: (mucGiam, record) => {
                if (record.loaiGiam === 'PHAN_TRAM') {
                    return `${mucGiam} %`;
                } else if (record.loaiGiam === 'TIEN_MAT') {
                    return `${mucGiam}` + ' vn₫';
                }
                return mucGiam;
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'ngayBatDau',
            key: 'ngayBatDau',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'ngayKetThuc',
            key: 'ngayKetThuc',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            filters: [
                { text: 'Sắp diễn ra', value: 'SAP_DIEN_RA' },
                { text: 'Đang diễn ra', value: 'DANG_DIEN_RA' },
                { text: 'Đã kết thúc', value: 'DA_KETTHUC' },
            ],
            onFilter: (value, record) => record.trangThai === value,
            render: (text) => {
                const { color, text: statusText } = getStatusProps(text);
                return <Tag color={color}>{statusText}</Tag>;
            },
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => (
                <div>
                    <Button
                        onClick={() => showProductDetails(record.id)}
                        style={{ marginRight: 8 }}
                    >
                        Chi tiết
                    </Button>
                    <ModalD recordId={record.id} onActionSuccess={reloadProducts} />
                </div>
                
            ),
        },
    ];

    const showProductDetails = async (id_dot_giam_gia) => {
        try {
            const response = await axios.get(`http://localhost:8080/csp/${id_dot_giam_gia}`);
            setSelectedProductDetails(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [resetTable]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/dot-giam-gia/hien-thi');
            setProducts(response.data);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
        setResetTable(false);
    };

    const reloadProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/dot-giam-gia/hien-thi');
            setProducts(response.data);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error reloading products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="body-container">
            <h3 style={{
                color: '#3498db',
                fontSize: '17px',
                textAlign: 'left',
                fontFamily: 'Arial, sans-serif',
                margin: '20px 0',
                padding: '10px',
                borderRadius: '5px',
            }}>
                Quản lý đợt giảm giá
            </h3>
            <div style={{ marginBottom: '20px' }}>
                <Search
                    placeholder="Tìm kiếm đợt giảm giá"
                    enterButton="Search"
                    size="large"
                    onSearch={(value) => handleSearch(value)}
                    style={{ width: '20%' }} // Đặt chiều rộng cho trường tìm kiếm
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px', fontWeight: 'bold' }}>Trạng thái:</div>
                    <Radio.Group onChange={handleStatusChange} value={selectedStatus}>
                        <Radio value="">Tất cả</Radio>
                        <Radio value="DA_KETTHUC">Đã kết thúc</Radio>
                        <Radio value="DANG_DIEN_RA">Đang diễn ra</Radio>
                        <Radio value="SAP_DIEN_RA">Sắp diễn ra</Radio>
                    </Radio.Group>
                </div>
            </div>
            <div>
                    <Button type="primary" onClick={handleAddClick}>
                        Thêm Đợt
                    </Button>
                </div>
            <Table
                columns={columns}
                dataSource={searchResults}
                loading={loading}
                pagination={{ pageSize: 6 }}
                key={resetTable ? 'reset' : 'table'}
                style={{ margin: '10px' }}
            />
            {selectedProductDetails && (
                <ProductDetail productDetails={selectedProductDetails} />
            )}
        </div>
    );
}
