import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import axios from 'axios'
import moment from 'moment'
import { HeartTwoTone } from '@ant-design/icons'

export default function Detail (props) {
  const [newsInfo, setNewsInfo] = useState(null)
  useEffect(() => {
    // console.log(props.match.params.id)
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then(res => {
        // console.log(res.data)
        setNewsInfo({ ...res.data, view: res.data.view + 1 })

        // 同步后端
        return res.data
      })
      .then(res => {
        axios.patch(`/news/${props.match.params.id}`, {
          view: res.view + 1
        })
      })
  }, [props.match.params.id])

  function handleStar () {
    setNewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1
    })
    axios.patch(`/news/${props.match.params.id}`, {
      star: newsInfo.star + 1
    })
  }

  return (
    <div style={{ margin: '20px auto', width: '95%' }}>
      {newsInfo && (
        <div>
          <div
            style={{
              fontSize: '30px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            <span
              onClick={() => {
                props.history.goBack()
              }}
            >
              ←{' '}
            </span>
            {newsInfo.title}
            <span style={{ marginLeft: '20px', fontSize: '26px' }}>
              <HeartTwoTone twoToneColor='#eb2f96' onClick={handleStar} />
            </span>
          </div>
          <Descriptions>
            <Descriptions.Item label='分类'>
              {newsInfo.category.title}
            </Descriptions.Item>
            <Descriptions.Item label='创建者'>
              {newsInfo.author}
            </Descriptions.Item>

            <Descriptions.Item label='发布时间'>
              {newsInfo.publishTime
                ? moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label='区域'>
              {newsInfo.region}
            </Descriptions.Item>

            <Descriptions.Item label='访问数量'>
              {newsInfo.view}
            </Descriptions.Item>
            <Descriptions.Item label='点赞数量'>
              {newsInfo.star}
            </Descriptions.Item>
            <Descriptions.Item label='评论数量'>0</Descriptions.Item>
          </Descriptions>
          <div
            style={{
              fontSize: '16px',
              color: 'grey',
              marginBottom: '10px',
              textAlign: 'center'
            }}
          >
            新闻内容:
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo.content
            }}
            style={{
              border: '1px solid grey',
              overflow: 'auto',
              padding: '10px'
            }}
          ></div>
        </div>
      )}
    </div>
  )
}
