import React , {useState,useRef, useEffect} from 'react'
import { Layout, Input, Space,Button,message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone,LockOutlined, UserOutlined,PoweroffOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom'

import md5 from 'js-md5'
import baseUrl from './api/config';

const salts = "qwertyuiopasdfghjklzxcvbnm9632587410"

function Login(){
  // 使用history实现路由跳转
  const history = useHistory()
  // loading状态
  const [loading,setLoading] = useState(false)
  // account password
  const [account,setAccount] = useState('')
  const [password,setPassword] = useState('')
  // 获取accout DOM元素
  const accountRef:any = useRef(null)

  const handleAccount = (e:any) => {
    setAccount(e.target.value)
  }

  const handlePassword = (e:any) => {
    setPassword(e.target.value)
  }

  const handleLogin = () => {
    // loading状态 检查输入规则 加密 加盐(用密码第二位去换盐值) login请求
    setLoading(true)
    if(account.length>=3 && password.length>=6){
      const password_md5 = md5(password)
      const start = salts.indexOf(password[1])
      const salt = salts.substr(start,6)
      const password_md5_salt = md5(password_md5+salt)
      fetchLogin(password_md5_salt)
    }
  }

  const fetchLogin = (password_md5_salt:string) => {
    fetch(baseUrl+'routes/login',{
        method:'post',
        body:JSON.stringify({
            account,
            password:password_md5_salt
        }),
        headers:{'Content-Type': 'application/json'}
    }).then((res)=>{
        return res.json()
    }).then((data)=>{
        setLoading(false)
        if(data.success){
            message.success(data.msg)
            localStorage.setItem('token',data.data)
            history.push('/app')
        }else{
            message.error(data.msg)
        }
    })
  }

  useEffect(()=>{
    accountRef.current.focus()
  },[])


  return (
    <>
     <Layout style={{ minHeight: '100vh',backgroundColor:'#2b1216'}}>
        <Space direction="vertical" className="space">

          <Input 
            size="large" 
            ref={accountRef}
            maxLength={16}
            placeholder="account" 
            className="input"
            onChange={handleAccount}
            prefix={<UserOutlined />} />

          <Input.Password
            size="large"
            maxLength={24}
            placeholder="password"
            className="input"
            onChange={handlePassword}
            onPressEnter={handleLogin}
            prefix={<LockOutlined />}
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />

          <Button
            type="primary"
            icon={<PoweroffOutlined />}
            loading={loading}
            className="button"
            onClick={handleLogin}
          >
            握手
          </Button>

        </Space>
      </Layout>
    </>
  )
}

export default Login
