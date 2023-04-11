import React, { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import axios from 'axios'

export default function AuditList (props) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  // `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
  useEffect(() => {
    axios.get(`/news?author=${username}&_expand=category`).then(res => {
      console.log(res.data)
      setDataSource(res.data)
    })
  }, [username])

  // 撤销
  const handleRervert = item => {
    console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    })
  }

  const columns = [
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
      title: '新闻分类',
      dataIndex: 'category',
      render: category => {
        return category.title
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: auditState => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '审核中', '已通过', '未通过']

        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: item => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button onClick={() => handleRervert(item)}>撤销</Button>
            )}
            {item.auditState === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type='primary' onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  // 更新
  const handleUpdate = item => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  // 发布
  const handlePublish = item => {
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime:Date.now()
    })
    props.history.push(`/publish-manage/published`)
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
