import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import axios from 'axios'
import moment from 'moment'

export default function NewsPreview (props) {
  const [newsInfo, setNewsInfo] = useState(null)
  useEffect(() => {
    console.log(props.match.params.id)
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then(res => setNewsInfo(res.data))
  }, [props.match.params.id])

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  const colorList = ['black', 'orange', 'green', 'red']
  return (
    <div>
      {newsInfo && (
        <div>
          <div
            style={{
              fontSize: '30px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
            onClick={() => {
              props.history.goBack()
            }}
          >
            ← 预览新闻
          </div>
          <Descriptions title={newsInfo.title}>
            <Descriptions.Item label='分类'>
              {newsInfo.category.title}
            </Descriptions.Item>
            <Descriptions.Item label='创建者'>
              {newsInfo.author}
            </Descriptions.Item>
            <Descriptions.Item label='创建时间'>
              {moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label='发布时间'>
              {newsInfo.publishTime
                ? moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label='区域'>
              {newsInfo.region}
            </Descriptions.Item>
            <Descriptions.Item label='审核状态'>
              <span style={{ color: colorList[newsInfo.auditState] }}>
                {auditList[newsInfo.auditState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label='发布状态'>
              <span style={{ color: colorList[newsInfo.publishState] }}>
                {publishList[newsInfo.publishState]}
              </span>
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
