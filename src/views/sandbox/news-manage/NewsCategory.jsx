import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Table, Popconfirm, Form, Input } from 'antd'
import axios from 'axios'
import { DeleteOutlined } from '@ant-design/icons'

export default function NewsCategory (props) {
  const [dataSource, setDataSource] = useState([])
  const EditableContext = React.createContext(null)
  const [count, setCount] = useState(0)
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  useEffect(() => {
    axios.get(`/categories`).then(res => {
      // console.log(res.data)
      setDataSource(res.data)
    })
  }, [])
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])
    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }
    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({
          ...record,
          ...values
        })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }
    let childNode = children
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`
            }
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className='editable-cell-value-wrap'
          style={{
            paddingRight: 24
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }
    return <td {...restProps}>{childNode}</td>
  }
  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      editable: true
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
          </div>
        )
      }
    }
  ]

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave
      })
    }
  })
  const handleSave = row => {
    console.log(row)
    const newData = [...dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    setDataSource(newData)
    axios.patch(`/categories/${row.id}`, {
      title: row.title,
      value: row.title
    })
  }

  // 删除
  const deleteMethod = item => {
    console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }
  // 添加
  const handleAdd = () => {
    const newData = {
      title: '请输入栏目名称',
      value: '1'
    }
    setDataSource([newData, ...dataSource])
    setCount(count + 1)
    axios.post('/categories', {
      ...newData
    })
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }

  return (
    <div>
      <Button
        onClick={handleAdd}
        type='primary'
        style={{
          marginBottom: 16
        }}
      >
        添加
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
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
