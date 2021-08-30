import React, { useState, useEffect, useContext } from 'react';
import { Modal, Input, Rate, Select, message,Upload,Button,Slider } from 'antd';
import { FormOutlined,UploadOutlined  } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import ReactQuill from 'react-quill';

import baseUrl from '../api/config';
// 导入全局状态方法
import { SetUpdateContext } from '../App'

// 使用Select的Option组件
const { Option } = Select;
// 设定Star对应的文本
const desc = ['common', 'special', 'important', 'necessary', 'immediately'];

export default function Popup(props:any){
  // 使用全局状态方法
  const setUpdate:any = useContext(SetUpdateContext)
  
  // 提交请求Loading
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  // 获取接口Note类型
  const [option,setOption] = useState([])

  
  // Modal 6个参数
  const [select,setSelect] = useState('react')
  const [index,setIndex] = useState()
  const [title, setTitle] = useState('');
  const [quill, setQuill] = useState('');
  const [slider,setSlider] = useState(1)
  const [star,setStar] = useState(1)

  const uploadProps = {
    name: 'file',
    maxCount : 1,
    showUploadList:false,
    action: baseUrl+'note/upload',
    headers: {
      token: localStorage.getItem('token') || ''
    },
    onChange(info:any) {
      if (info.file.status !== 'uploading') {
        const fileList = info.fileList[0]
        const res =  JSON.parse(fileList.xhr.response)
        console.log(res)
        if(res.success){
          const data = res.data
          const imgUrl = baseUrl + data.destination + data.filename
          const imgLabel = `<img src="${imgUrl}" alt="description" />`
          console.log(imgLabel)
          setQuill(quill+imgLabel)
        }
      }
      if (info.file.status === 'done') {
        message.success('上传成功');
      } else if (info.file.status === 'error') {
        message.error('上传失败');
      }
    },
  };

  const cropProps = {
    aspect:slider,
    rotate:true,
    quality:1,
    minZoom:1,
    maxZoom:3,
    modalTitle:'裁切图片',
    modalOk:'确定',
    modalCancel:'取消'
  };

  // quill配置项
  const modules = {
    toolbar:[
      ['bold', 'italic', 'strike'],        // toggled buttons
      ['link'],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'color': [] }],          // dropdown with defaults from theme
      ['code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent 
      [{ 'align': [] }],
    ],
    clipboard: { matchVisual: false }
  }


  const marks = {
    0: '0',
    1: '1',
    2: '2',
    3: {
      style: {
        color: '#f50',
      },
      label: <strong>3</strong>,
    },
  };


  // 添加笔记请求
  const fetchAdd = () => {
    fetch(baseUrl+'note/addNote',{
      method:'post',
      body:JSON.stringify({
        route:select,
        index:index,
        title:title,
        content:quill,
        important:star
      }),
      headers:{'Content-Type': 'application/json','token':localStorage.getItem('token') || ''}
    }).then((res)=>{
      return res.json()
    }).then((data)=>{
      if(data.success){
        // 提示保存成功 取消加载状态 隐藏Modal 清除参数数据 设置全局状态变量
        message.success(data.msg)
        setConfirmLoading(false);
        props.handleVisible();
        handleClear()
        setUpdate((update:any) => !update)
      }else{
        message.error(data.msg)
        setConfirmLoading(false);
      }
    })
  }

  // 更新笔记请求
  const fetchEdit = () => {
    fetch(baseUrl+'note/updateNote',{
      method:'post',
      body:JSON.stringify({
        id:props.value.id,
        route:select,
        title:title,
        content:quill,
        important:star
      }),
      headers:{'Content-Type': 'application/json','token':localStorage.getItem('token') || ''}
    }).then((res)=>{
      return res.json()
    }).then((data)=>{
      if(data.success){
        // 提示保存成功 取消加载状态 隐藏Modal 清除参数数据 设置全局状态变量
        message.success(data.msg)
        setConfirmLoading(false)
        props.handleVisible()
        handleClear()
        setUpdate((update:any) => !update)
      }else{
        message.error(data.msg)
        setConfirmLoading(false)
      }
    })
  }

  // 提交Modal请求
  const handleOk = () => {
    console.log(select,index,title,quill,star)
    setConfirmLoading(true);
    if(props.handle === 'add') fetchAdd()
    else if(props.handle === 'edit') fetchEdit()
  };

  // 取消Modal
  const handleCancel = () => {
    props.handleVisible();
  };

  // 监听 5个参数
  const handleSelectChange = (e:any) => {
    setSelect(e)
  }

  const handleIndexChange = (e:any) => {
    setIndex(e.target.value)
  }

  const handleInputChange = (e:any) => {
    setTitle(e.target.value)
  }
  const handleQuillChange = (e:any) => {
    setQuill(e)
  }

  const handleSlider = (e:any) => {
    setSlider(e)
  }

  const handleStarChange = (e:any) => {
    setStar(e)
  }

  // 获取接口Note类型
  useEffect(()=>{
    // Modal 被导入两次，因此会请求两次
    if(props.handle){
      fetch(baseUrl+'routes/getRoutes',{
        method:'get',
        headers:{'Content-Type': 'application/json','token':localStorage.getItem('token') || ''}
      }).then((res)=>{
        return res.json()
      }).then((data)=>{
        if(data.success){
          const resObj = data.data.reduce((acc:any,obj:any)=>{
            if(!acc) acc = []
            acc = acc.concat(obj.children)
            return acc 
          },[])
          setOption(resObj)
        }
      })
    }
  },[])

  // 清除参数数据
  const handleClear = () => {
    setTitle('')
    setQuill('')
    setStar(1)
  };





  // 监听props传值为 add 或者 edit
  useEffect(()=>{
    if(props.visible && props.handle === 'edit'){
      const { title,content,important } = props.value
      setTitle(title)
      setQuill(content)
      setStar(important)
    }
  },[props])




  return (
    <>
      <Modal
        title="条目"
        visible={props.visible}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>

        <Select 
          defaultValue="react" 
          style={{ width: 120,marginBottom:'20px' }} 
          onChange={handleSelectChange}>
            {option.map(((item:any)=>{
              return (
                <Option value={item.key} key={item.key}>{item.title}</Option>
              )
            }))}
        </Select>


        <Input 
            size="large" 
            value={title}
            placeholder="标题" 
            style={{marginBottom:'20px'}}
            prefix={<FormOutlined />} 
            onChange={handleInputChange} />
        

        <ReactQuill
            theme="snow" 
            value={quill}
            placeholder="内容" 
            style={{marginBottom:'20px'}}
            onChange={handleQuillChange}
            modules={modules}  />

            
        <ImgCrop {...cropProps}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} style={{marginBottom:'20px'}}>图片</Button>
          </Upload>
        </ImgCrop>

        <Slider 
          marks={marks} 
          step={0.2}
          min={0.2}
          max={3} 
          value={slider}
          onChange={handleSlider} />
        <div>
          <Rate 
            tooltips={desc} 
            style={{color:'#ed5a65',marginBottom:'20px'}}
            onChange={handleStarChange} 
            value={star} />
          {star? <span className="ant-rate-text">{desc[star - 1]}</span> : ''}
        </div>

        {
          props.handle === 'add'? (
            <Input 
            size="large" 
            type="number"
            maxLength={3}
            value={index}
            placeholder="插入位置" 
            style={{width:'30%',display:'block'}}
            onChange={handleIndexChange} />
          ):null
        }

      </Modal>
    </>
  );
};