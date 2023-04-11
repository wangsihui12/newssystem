import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Popconfirm, Switch, Popover, Modal, Form } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

export default function UserList () {
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [dataSource, setDataSource] = useState([]) // 用户列表
  const [open, setOpen] = useState(false) // 控制添加modal显示状态
  const [open2, setOpen2] = useState(false) // 控制更新modal显示状态
  const [roleList, setRoleList] = useState([]) // 区域列表
  const [regionList, setRegionList] = useState([]) // 区域列表
  const [currentData, setCurrentData] = useState(null) // 当前的数据

  // 获取角色列表
  useEffect(() => {
    axios.get('/roles').then(res => {
      //   console.log(res.data)
      const list = res.data
      setRoleList(list)
    })
  }, [])
  // 获取区域列表
  useEffect(() => {
    axios.get('/regions').then(res => {
      //   console.log(res.data)
      const list = res.data
      setRegionList(list)
    })
  }, [])
  // 添加
  const onCreate = values => {
    console.log('Received values of form: ', values)
    setOpen(false)
    // post到后端，生成id，再设置dataSource,方便后面的删除和更新
    axios
      .post('/users', {
        ...values,
        roleState: true,
        default: false
      })
      .then(res => {
        console.log(res.data)
        setDataSource([
          ...dataSource,
          {
            ...res.data,
            role: roleList.filter(item => item.id === values.roleId)[0]
          }
        ])
      })
  }
  // 更新
  const onUpdate = values => {
    console.log('Received values of form: ', values)
    setOpen2(false)
    // patch到后端，生成id，再设置dataSource,方便后面的删除和更新
    axios.patch(`/users/${currentData.id}`, values)
    setDataSource(
      dataSource.map(item => {
        if (item.id === currentData.id) {
          return {
            ...item,
            ...values,
            role: roleList.filter(data => data.id === values.roleId)[0]
          }
        }
        return item
      })
    )
    setIsUpdateDisabled(!isUpdateDisabled)
  }
  // 获取用户列表
  useEffect(() => {
    const { roleId, region, username } = JSON.parse(
      localStorage.getItem('token')
    )
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get('/users?_expand=role').then(res => {
      // console.log(res.data)
      const list = res.data
      setDataSource(
        roleObj[roleId] === 'superadmin'
          ? list
          : [
              ...list.filter(item => item.username === username),
              ...list.filter(
                item =>
                  item.region === region && roleObj[item.roleId] === 'editor'
              )
            ]
      )
    })
  }, [])

  // 删除
  const deleteMethod = item => {
    console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  // 修改用户状态
  const handleChaneg = item => {
    // console.log(item)
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  // 编辑
  const handleUpdate = item => {
    console.log(item)
    setCurrentData(item)
    setOpen2(true)

    if (item.roleId === 1) {
      // 禁用
      setIsUpdateDisabled(true)
    } else {
      // 取消禁用
      setIsUpdateDisabled(false)
    }
    setTimeout(() => {
      // 数据回显
      updateForm.current.setFieldsValue(item)
    }, 0)
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      // 筛选
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        { text: '全球', value: '全球' }
      ],
      // 筛选过滤
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      render: region => {
        return (
          <div>
            <b>{region === '' ? '全球' : region}</b>
          </div>
        )
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: role => {
        return <div>{role.roleName}</div>
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChaneg(item)}
          ></Switch>
        )
      }
    },
    {
      title: '操作',
      render: item => {
        return (
          <div>
            <Popconfirm
              title='Delete the task'
              description='Are you sure to delete this task?'
              okText='Yes'
              cancelText='No'
              onConfirm={() => deleteMethod(item)}
            >
              <Button
                danger
                shape='circle'
                icon={<DeleteOutlined />}
                disabled={item.default}
              ></Button>
            </Popconfirm>
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => switchMethod(item)}
                  ></Switch>
                </div>
              }
              title='页面配置项'
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button
                type='primary'
                shape='circle'
                icon={<EditOutlined />}
                disabled={item.default}
                onClick={() => handleUpdate(item)}
              />
            </Popover>
          </div>
        )
      }
    }
  ]

  function switchMethod (item) {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])

    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }

  // 添加modal
  const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm()
    return (
      <Modal
        open={open}
        title='添加用户'
        okText='确定'
        cancelText='取消'
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields()
              onCreate(values)
            })
            .catch(info => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <UserForm
          form={form}
          ref={addForm}
          roleList={roleList}
          regionList={regionList}
        ></UserForm>
      </Modal>
    )
  }

  // 更新modal
  const CollectionUpdateForm = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm()
    form.setFieldsValue()
    return (
      <Modal
        forceRender
        open={open}
        title='更新用户'
        okText='确定'
        cancelText='取消'
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields()
              onCreate(values)
            })
            .catch(info => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <UserForm
          form={form}
          ref={updateForm}
          roleList={roleList}
          isUpdateDisabled={isUpdateDisabled}
          regionList={regionList}
          isUpdate={true}
        ></UserForm>
      </Modal>
    )
  }

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setOpen(true)
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
      ;
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <CollectionUpdateForm
        open={open2}
        onCreate={onUpdate}
        onCancel={() => {
          setOpen2(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
      />
    </div>
  )
}
