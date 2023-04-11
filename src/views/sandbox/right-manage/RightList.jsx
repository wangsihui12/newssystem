import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Popconfirm, Switch, Popover } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function RightList () {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      // console.log(res.data)
      const list = res.data

      list.forEach(item => {
        if (item.children.length === 0) item.children = ''
      })
      setDataSource(list)
    })
  }, [])

  // 删除
  const deleteMethod = item => {
    console.log(item)
    // 当前页面同步状态+后端同步
    if (item.grade === 1) {
      // 删除一级菜单
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      // 删除二级菜单
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      console.log(list, dataSource)
      axios.delete(`/children/${item.id}`)
      setDataSource([...dataSource])
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => {
        return <div>{id}</div>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: key => {
        return <Tag color='orange'>{key}</Tag>
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
              <Button danger shape='circle' icon={<DeleteOutlined />}></Button>
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
                disabled={item.pagepermisson === undefined}
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

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
      />
      ;
    </div>
  )
}
