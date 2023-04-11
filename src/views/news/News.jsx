import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List } from 'antd'
import _ from 'lodash'
export default function News () {
  const [list, setList] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      console.log(
        Object.entries(_.groupBy(res.data, item => item.category.title))
      )
      setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
    })
  }, [])
  return (
    <div style={{ margin: '0 auto', width: '95%' }}>
      <h1>全球大新闻</h1>
      <Row gutter={[16, 16]}>
        {list.map(item => (
          <Col span={8} key={item[0]}>
            <Card title='Card title' bordered={true} hoverable>
              <List
                size='small'
                dataSource={item[1]}
                pagination={{
                  pageSize: 3
                }}
                renderItem={data => (
                  <List.Item>
                    <a href={`#/detail/${data.id}`}>{data.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
