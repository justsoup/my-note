import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { FormOutlined,CloseCircleOutlined  } from '@ant-design/icons';
// 导入Popup组件
import Popup from '../components/Modal'

export default function Header(props:any){
    // 使用history实现路由跳转
    const history = useHistory()
    // Modal 显示隐藏
    const [visible, setVisible] = useState(false);

    // Modal 显示隐藏
    const handleVisible = () => {
        setVisible(!visible)
    };
    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('token')
        history.goBack()
    };

    return (
        <header>
            <Popup 
                handle='add' 
                visible={visible}
                handleVisible={handleVisible} />
            <Button 
                type="primary" 
                icon={<FormOutlined />}
                onClick={handleVisible}>
            </Button>
            <Button 
                danger
                type="primary" 
                icon={<CloseCircleOutlined />}
                onClick={handleLogout}>
            </Button>
        </header>
    )
}