import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, Form, Input, Select, message } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/user-manage/NewsEditor'
const { Option } = Select

export default function NewsUpdate (props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({}) // 存储第一步数据：新闻标题和新闻分类
  const [content, setContent] = useState('') // 存储第二步数据：新闻主题内容（富文本数据）
  const NewsForm = useRef(null) // 获取第一步数据

  // 下一步
  function handleNext () {
    // 判断表单数据是否为空
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then(res => {
          console.log(res)
          setCurrent(current + 1)
          setFormInfo(res)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }
    }
  }

  // 上一步
  function handlePrevious () {
    setCurrent(current - 1)
  }
  const onFinish = values => {
    console.log('Success:', values)
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  // 新闻分类选择
  const onGenderChange = values => {
    console.log('Success:', values)
  }

  // 获取新闻分类列表
  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  useEffect(() => {
    console.log(props.match.params.id)
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then(res => {
        let { title, categoryId, content } = res.data
        NewsForm.current.setFieldsValue({
          title,
          categoryId
        })

        setContent(content)
      })
  }, [props.match.params.id])

  // 保存
  const handSave = auditState => {
    axios
      .patch(`/news/${props.match.params.id}`, {
        ...formInfo,
        content: content,
        auditState: auditState // 审核状态，0：草稿箱，1：审核列表
      })
      .then(res => {
        // 如果 auditState 值为0，页面跳转到草稿箱，如果为1,跳转到审核列表
        props.history.push(
          auditState === 0 ? '/news-manage/draft' : '/audit-manage/list'
        )
      })
  }

  return (
    <div>
      <div
        style={{ fontSize: '30px', marginBottom: '20px' }}
        onClick={() => {
          props.history.goBack()
        }}
      >
        {' '}
        ← 更新新闻
      </div>

      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description: '新闻标题，新闻分类'
          },
          {
            title: '新闻内容',
            description: '新闻主题内容'
          },
          {
            title: '新闻提交',
            description: '保存到草稿或提交审核'
          }
        ]}
      />

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            name='basic'
            labelCol={{
              span: 4
            }}
            wrapperCol={{
              span: 20
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
            ref={NewsForm}
          >
            <Form.Item
              label='新闻标题'
              name='title'
              rules={[
                {
                  required: true,
                  message: '请选择新闻标题!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='新闻分类'
              name='categoryId'
              rules={[
                {
                  required: true,
                  message: '请选择新闻分类!'
                }
              ]}
            >
              <Select
                placeholder='请选择新闻分类'
                onChange={onGenderChange}
                allowClear
              >
                {categoryList.map(item => (
                  <Option value={item.id} key={item.value}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>

        {/* 富文本 */}
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor
            getContent={value => {
              console.log(value)
              setContent(value)
            }}
            content={content}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type='primary' onClick={() => handSave(0)}>
              保存到草稿箱
            </Button>
            <Button danger onClick={() => handSave(1)}>
              提交审核
            </Button>
          </span>
        )}

        {current < 2 && (
          <Button type='primary' onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  )
}
