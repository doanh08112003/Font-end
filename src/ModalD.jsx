import React, { useState } from 'react';
import { Button, Modal, Space, notification } from 'antd';
import { AiOutlineDelete } from "react-icons/ai";
import axios from 'axios';

const ModalD = ({ recordId, onActionSuccess }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, title, description, placement) => {
        if (type === "error") {
            api.error({
                message: title,
                description: description,
                placement,
            });
        } else {
            api.success({
                message: title,
                description: description,
                placement,
            });
        }
    };

    const [open, setOpen] = useState(false);

    const showModal = () => {
        console.log(recordId);
        setOpen(true);
    };

    const handleOk = () => {
        handleClickDelete(recordId);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleClickDelete = async (id) => {
        try {
            await axios.patch(`http://localhost:8080/dot-giam-gia/delete/${id}`);
            console.log(id);
            onActionSuccess();
            openNotification("success", "Hệ thống", "Đổi trạng thái thành công ~", "bottomRight");
        } catch (error) {
            console.error('Error deleting product:', error);
            openNotification("error", "Hệ thống", "Đổi trạng thái thất bại!", "bottomRight");
        }
    }

    return (
        <>
            {contextHolder}
            <Space>
                <Button danger shape="circle" icon={<AiOutlineDelete />} onClick={showModal} />
            </Space>
            <Modal
                open={open}
                title="Đổi trạng thái sản phẩm ~"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn đổi trạng thái đợt giảm giá này?</p>
            </Modal>
        </>
    );
};

export default ModalD;
