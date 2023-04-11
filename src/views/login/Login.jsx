import React from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
// npm install react-particles-js@2.4.0 --legacy-peer-deps 安装粒子效果
import Particles from 'react-particles-js'
import './Login.css'
import axios from 'axios'

export default function Login (props) {
  const onFinish = values => {
    // console.log('Success:', values)
    axios
      .get(
        `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then(res => {
        console.log(res.data)
        if (res.data.length === 0) {
          message.error('用户名或密码不匹配')
        } else {
          localStorage.setItem('token', JSON.stringify(res.data[0]))
          props.history.push('/home')
        }
      })
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div
      style={{ background: 'rgb(35,39,65', height: '100%', overflow: 'hidden' }}
    >
      <Particles height={document.documentElement.clientHeight} />
      <div className='formContainer'>
        <div className='loginTitle'>管理系统</div>
        <Form
          name='basic'
          labelCol={{
            span: 8
          }}
          wrapperCol={{
            span: 16
          }}
          style={{
            maxWidth: 600
          }}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[
              {
                required: true,
                message: 'Please input your username!'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name='remember'
            valuePropName='checked'
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Button type='primary' htmlType='submit'>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
