import React, { useState,useEffect, useContext, useCallback } from 'react';
import { Rate, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined  } from '@ant-design/icons';
// 导入全局状态参数
import { UpdateContext, SetUpdateContext } from '../App'
// 导入Popup组件
import Popup from '../components/Modal'

import baseUrl from '../api/config';

interface Note{
    id:string,
    title:string,
    content:string,
    important:number
}

export default function Note(props:any){
    // 使用全局状态参数
    const update = useContext(UpdateContext)
    // 使用全局状态方法
    const setUpdate:any = useContext(SetUpdateContext)
    // 获取接口Note数据
    const [data,setData] = useState([])
    // Modal 显示隐藏
    const [visible, setVisible] = useState(false);
    // 修改Note传参
    const [value,setValue] = useState({})
    // Modal 显示隐藏
    const handleVisible = (e:any,note:Note) => {
        setVisible(!visible)
        setValue(note)
    };
    // 删除Note
    const handleDel = (id:string) => {
        const path = props.path
        fetch(baseUrl+'note/delNote',{
            method:'post',
            body:JSON.stringify({
                id,
                route:path
            }),
            headers:{'Content-Type': 'application/json','token':localStorage.getItem('token') || ''}
        }).then((res)=>{
            return res.json()
        }).then((data)=>{
            if(data.success){
                message.success(data.msg)
                setUpdate((update:any) => !update)
            }else{
                message.error(data.msg)
            }
        })
    };

    // 改变path 或者 新增Note 或者 删除Note 时重新请求Note数据
    useEffect(()=>{
        const path = props.path
        // 初始path为空，不请求
        if(path){
            fetch(baseUrl+`note/getNote?route=${path}`,{
                method:'get',
                headers:{'Content-Type': 'application/json','token':localStorage.getItem('token') || ''}
              }).then((res)=>{
                return res.json()
              }).then((data)=>{
                if(data.success){
                    console.log(data.data)
                    setData(data.data)
                }else{
                    setData([])
                }
            })
        }
    },[props.path,update])

    return (
        <div>
            {
                data.map((note:Note,index:number)=>{
                    return (
                        <div className="note-container" key={index}>
                            <div className="note-title">
                                <div>
                                    <span>{index}.</span>
                                    <span>{note.title}</span>
                                </div>
                                <Button 
                                    type="primary" 
                                    shape="circle" 
                                    icon={<EditOutlined />} 
                                    size='small' 
                                    style={{marginRight:'10px'}}
                                    onClick={(event)=>{handleVisible(event,note)}} />

                                <Popconfirm title="是否确定删除？" 
                                    okText="确定"
                                    cancelText="取消"
                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                    onConfirm={()=>{handleDel(note.id)}}>
                                    <Button 
                                        type="primary" 
                                        shape="circle" 
                                        icon={<DeleteOutlined />} 
                                        size='small' 
                                        danger />
                                </Popconfirm>

                            </div>
                            <div>
                                <Rate 
                                    disabled
                                    style={{color:'#ed5a65',margin:'10px 0'}}
                                    value={note.important} />
                            </div>
                            <div className="note-content upload-image-container" dangerouslySetInnerHTML={{__html:note.content}}></div>
                        </div>
                    )
                })
            }

            <Popup 
                handle='edit' 
                value={value}
                visible={visible}
                handleVisible={handleVisible} />
        </div>
    )
}
