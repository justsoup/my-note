import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter ,Route, Switch,Redirect } from 'react-router-dom'
import Login from './Login'
import App from './App'

// 引入通用CSS
import 'antd/dist/antd.css';
import 'react-quill/dist/quill.snow.css';
import './App.css'

ReactDOM.render(
  <BrowserRouter >
    <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/app' component={App}/>
        <Redirect to='/login'/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)
