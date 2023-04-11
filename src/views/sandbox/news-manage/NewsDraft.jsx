import React, { useState, useEffect } from 'react'
import { Button, Table, Popconfirm } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'

export default function NewsDraft (props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))

  // 获取草稿列表
  useEffect(() => {
    axios
      .get(`news?author=${username}&auditState=0&_expand=category`)
      .then(res => {
        // console.log(res.data)
        const list = res.data
        setDataSource(list)
      })
  }, [username])

  // 删除
  const deleteMethod = item => {
    console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
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
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: category => {
        return category.title
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
            <Button
              shape='circle'
              icon={<EditOutlined />}
              onClick={() =>
                props.history.push(`/news-manage/update/${item.id}`)
              }
            />
            <Button
              type='primary'
              shape='circle'
              icon={<UploadOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        )
      }
    }
  ]

  const handleCheck = id => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1
      })
      .then(res => {
        props.history.push('/audit-manage/list')
      })
  }

  return (
    <div>
      <Table
        rowKey={item => item.id}
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
