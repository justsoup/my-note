import React, { useState,useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { FileOutlined } from '@ant-design/icons';

import baseUrl from '../api/config';

const { SubMenu } = Menu;
const { Sider } = Layout;

interface Routes{
  title:string
  key:string
  children:Array<Object>
}

export default function Navs(props:any){
  // Navs菜单展开缩放
  const [collapsed, setCollapsed] = useState(false)
  // 获取接口导航列表
  const [routes,setRoutes] = useState([])
  
  // 触发回调，传给App组件点击参数
  const handleClick = (e:any) => {
    props.changeSelect(e.keyPath)
  }

  // 获取接口导航列表
  useEffect(()=>{
    fetch(baseUrl+'routes/getRoutes',{
      method:'get',
      headers:{'Content-Type': 'application/json','token':localStorage.getItem('token') || ''}
    }).then((res)=>{
      return res.json()
    }).then((data)=>{
      if(data.success) setRoutes(data.data)
    })
  },[])

  return (
  <Sider theme="light" collapsible collapsed={collapsed} onCollapse={()=>{setCollapsed(!collapsed)}}>
    <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
      {
        routes.map((route:Routes)=>{
          const {title,key,children} = route
          return (
            <SubMenu key={key} icon={<FileOutlined />} title={title}>
              {children?
                children.map((child:any)=>{
                  const {key:childKey,title:childTitle} = child
                  return (
                    <Menu.Item key={childKey} onClick={handleClick}>
                      {childTitle}
                    </Menu.Item>
                  )
                }):null
              }
            </SubMenu>
          )
        })
      }

    </Menu>
  </Sider>

  )
}