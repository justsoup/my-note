import React, { useState } from 'react'
import { Layout } from 'antd'

// 引入各部分组件
import Header from './components/Header'
import Navs from './components/Navs'
import Main from './components/Main'


// 导出context全局状态参数/方法
export const UpdateContext = React.createContext({})
export const SetUpdateContext = React.createContext({})

function App() {
  const [select,setSelect] = useState([])

  return (
    <>
      <Container>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Layout className="site-layout">
            <Navs changeSelect={(keyPath:any)=>{setSelect(keyPath)}} />
            <Main select={select} />
          </Layout>
        </Layout>
      </Container>
    </>
  )
}

// 全局状态共享组件
function Container(props:any){
  const [update, setUpdate] = useState(false)

  return (
    <UpdateContext.Provider value={update}>
      <SetUpdateContext.Provider value={setUpdate}>
        {/* App组件 */}
        {props.children}
      </SetUpdateContext.Provider>
    </UpdateContext.Provider>
  )
}

export default App
