import React, { useEffect, useState, useRef } from 'react';
import { Input, Table, Button, message, Space, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import ModalD from './ModalD';

const { Search } = Input;

export default function ProductDetail({ productDetails }) {
    const searchInput = useRef(null);
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resetTable, setResetTable] = useState(false);



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
            render: (text, record) => record.sanPhamChiTiet.sanPham.tensanpham + " [" + record.sanPhamChiTiet.mausac?.ten + '-' + record.sanPhamChiTiet.kichco?.ten + "]" || '',
        },
        {
            title: 'Số lượng',
            dataIndex: 'soluong',
            key: 'soluong',
            render: (text, record) => record.sanPhamChiTiet.soluong


        },

        {
            title: 'Khối lượng',
            dataIndex: 'khoiluong',
            key: 'khoiluong',
            render: (text, record) => record.sanPhamChiTiet.khoiluong
        },
        {
            title: 'Giá',
            dataIndex: 'gia',
            key: 'gia',
            render: (text, record) => record.sanPhamChiTiet.gia
        },


        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => (
                <div>
                    <ModalD recordId={record.id} onActionSuccess={reloadProducts} />
                </div>
            ),
        }
    ];



    useEffect(() => {
        loadProducts();
    }, [resetTable]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const result = await axios.get('http://localhost:8080/chitietsanpham/laydanhsach');
            setProducts(result.data);
            setSearchResults(result.data);
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
            const result = await axios.get('http://localhost:8080/chitietsanpham/laydanhsach');
            setProducts(result.data);
            setSearchResults(result.data);
        } catch (error) {
            console.error('Error reloading products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="body-container">
                <div className="button"
                    style={{
                        display: 'flex',
                        justifyContent: "flex-end",
                        margin: "10px",
                    }}>
                </div>
                <div>
                    <Form >
                        <Table

                            bordered
                            columns={columns}
                            dataSource={productDetails}
                            loading={loading}
                            pagination={{ pageSize: 6 }}
                            key={resetTable ? 'reset' : 'table'}
                            style={{ margin: '10px' }}
                        />
                    </Form>
                </div>
            </div>
        </div>
    );
}