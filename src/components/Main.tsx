import React, { useState, useEffect, useMemo } from 'react'
import { Layout, Breadcrumb } from 'antd';

// 导入Note组件
import Note from '../components/Note'
// 使用Layout的Content组件
const { Content } = Layout;

export default function Main(props:any){
  const [path1,setPath1] = useState('')
  const [path2,setPath2] = useState('')

  // 绑定App组件的select参数，select变化->path变化->传给Note组件的props.path发生变化
  useEffect(()=>{
    setPath1(props.select[0])
    setPath2(props.select[1])
  },[props.select])

  return (
    <Content style={{marginLeft:'10px',overflowY:'auto',height:'90vh' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>{path2}</Breadcrumb.Item>
          <Breadcrumb.Item>{path1}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Note path={path1}/>
        </div>
    </Content>
  )
}