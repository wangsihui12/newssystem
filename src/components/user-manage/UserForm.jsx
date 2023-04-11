import React, { useState, useEffect, forwardRef } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const UserForm = forwardRef((props, ref) => {
  const { form, roleList, regionList } = props
  // const [regionList, setRegionList] = useState([]) // 角色列表
  const [isDefault, setIsDefault] = useState(false)

  // 数据回显判断区域选择是否禁用
  useEffect(() => {
    setIsDefault(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  function changeRegion (value) {
    console.log(value)
  }

  function changeRole (value) {
    console.log(value)

    if (value === 1) {
      setIsDefault(true)
      ref.current.setFieldsValue({
        region: ''
      })
    } else {
      setIsDefault(false)
    }
  }

  const { roleId, region } = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    '1': 'superadmin',
    '2': 'admin',
    '3': 'editor'
  }

  function checkRegionDisabled (item) {
    if (props.isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return item.value !== region
      }
    }
  }
  function checkRoleDisabled (item) {
    if (props.isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return roleObj[item.id] !== 'editor'
      }
    }
  }
  return (
    <Form
      form={form}
      layout='vertical'
      name='form_in_modal'
      initialValues={{
        modifier: 'public'
      }}
      ref={ref}
    >
      <Form.Item
        name='username'
        label='用户名'
        rules={[
          {
            required: true,
            message: '请输入用户名!'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='password'
        label='密码'
        rules={[
          {
            required: true,
            message: '请输入密码!'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='region'
        label='区域'
        rules={[
          {
            required: !isDefault,
            message: '请选择区域!'
          }
        ]}
      >
        <Select
          placeholder='请选择区域'
          onChange={changeRegion}
          allowClear
          disabled={isDefault}
        >
          {regionList.map(item => {
            return (
              <Option
                value={item.value}
                key={item.id}
                disabled={checkRegionDisabled(item)}
              >
                {item.title}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name='roleId'
        label='角色'
        rules={[
          {
            required: true,
            message: '请选择角色!'
          }
        ]}
      >
        <Select placeholder='请选择角色' onChange={changeRole} allowClear>
          {roleList.map(item => {
            return (
              <Option
                value={item.id}
                key={item.id}
                disabled={checkRoleDisabled(item)}
              >
                {item.roleName}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm
