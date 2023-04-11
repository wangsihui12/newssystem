import { Table, Button, Popconfirm, Modal, Tree } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

export default function RoleList () {
  const [dataSource, setDataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [treeData, setTreeData] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState([])

  useEffect(() => {
    axios.get(`/roles`).then(res => {
      // console.log(res.data)
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/rights?_embed=children`).then(res => {
      // console.log(res.data)
      setTreeData(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => {
        return (
          <div>
            <b>{id}</b>
          </div>
        )
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
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
                type='primary'
                shape='circle'
                icon={<DeleteOutlined />}
              ></Button>
            </Popconfirm>

            <Button
              danger
              shape='circle'
              icon={<EditOutlined />}
              onClick={() => {
                showModal(item)
              }}
            />
          </div>
        )
      }
    }
  ]

  // 删除
  const deleteMethod = item => {
    // console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }

  const showModal = item => {
    setCurrentRights(item.rights)
    setIsModalOpen(true)
    setCurrentId(item.id)
  }

  const handleOk = () => {
    console.log(currentRights)
    setIsModalOpen(false)
    // 同步dataSource
    setDataSource(
      dataSource.map(item => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights
          }
        }
        return item
      })
    )

    // patch
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info)
    setCurrentRights(checkedKeys.checked)
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={item => item.id}
      ></Table>
      {/* 编辑 */}
      <Modal
        title='Basic Modal'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
