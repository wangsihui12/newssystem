import React, { useEffect, useState } from 'react'
import { Button, message, Table } from 'antd'
import axios from 'axios'

export default function Audit (props) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  // `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
  useEffect(() => {
    const { roleId, region, username } = JSON.parse(
      localStorage.getItem('token')
    )
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      console.log(res.data)
      const list = res.data
      setDataSource(
        roleObj[roleId] === 'superadmin'
          ? list
          : [
              ...list.filter(item => item.author === username),
              ...list.filter(
                item =>
                  item.region === region && roleObj[item.roleId] === 'editor'
              )
            ]
      )
    })
  }, [username])

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
      title: '操作',
      render: item => {
        return (
          <div>
            <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>
              通过
            </Button>
            <Button danger onClick={() => handleAudit(item, 3, 0)}>
              驳回
            </Button>
          </div>
        )
      }
    }
  ]

  // 通过/驳回
  const handleAudit = (item, auditState, publishState) => {
    console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios
      .patch(`/news/${item.id}`, {
        auditState: auditState,
        publishState: publishState
      })
      .then(res => {
        message.success('成功')
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
