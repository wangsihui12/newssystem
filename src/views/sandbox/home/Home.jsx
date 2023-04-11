import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined
} from '@ant-design/icons'
import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card
export default function Home () {
  const [viewList, setViewList] = useState([])
  const [pieChart, setPieChart] = useState(null)
  const [allList, setAllList] = useState([])
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=view&_oreder=desc&_limit=6`
      )
      .then(res => {
        // console.log(res.data)
        setViewList(res.data)
      })
  }, [])
  const [startList, setStartList] = useState([])
  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=start&_oreder=desc&_limit=6`
      )
      .then(res => {
        // console.log(res.data)
        setStartList(res.data)
      })
  }, [])

  const {
    username,
    region,
    role: { roleName }
  } = JSON.parse(localStorage.getItem('token'))

  const barRef = useRef()
  const pieRef = useRef()

  // 渲染柱状图
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      // console.log(res.data)
      // console.log(_.groupBy(res.data, item => item.category.title))
      renderBarView(_.groupBy(res.data, item => item.category.title))
    })

    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = obj => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1 // 自动计算的坐标轴最小间隔大小。
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    window.onresize = () => {
      // console.log('resize')
      myChart.resize()
    }
  }
  // 渲染饼状图
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      // console.log(res.data)
      // console.log(_.groupBy(res.data, item => item.category.title))
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })

    return () => {
      window.onresize = null
    }
  }, [])

  const renderPieView = obj => {
    // 数据处理
    var currentList = allList.filter(item => item.author === username)
    // console.log(currentList)
    var groupObj = _.groupBy(currentList, item => item.category.title)

    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option

    option = {
      title: {
        text: '新闻分类图示',
        subtext: '当前用户',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    option && myChart.setOption(option)
  }
  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(true)
    setTimeout(() => {
      renderPieView()
    }, 0)
  }
  const onClose = () => {
    setOpen(false)
  }
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title='用户最常浏览' bordered={true}>
            <List
              dataSource={viewList}
              renderItem={item => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='用户点赞最多' bordered={true}>
            <List
              dataSource={startList}
              renderItem={item => (
                <List.Item>
                  {' '}
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt='example'
                src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
              />
            }
            actions={[
              <SettingOutlined key='setting' onClick={showDrawer} />,
              <EditOutlined key='edit' />,
              <EllipsisOutlined key='ellipsis' />
            ]}
          >
            <Meta
              avatar={<Avatar src='https://joesch.moe/api/v1/random' />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ marginLeft: '20px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width='500px'
        title='个人新闻分类'
        placement='right'
        onClose={onClose}
        open={open}
      >
        <div
          ref={pieRef}
          style={{ width: '100%', height: '400px', marginTop: '50px' }}
        ></div>
      </Drawer>
      <div
        ref={barRef}
        style={{ width: '100%', height: '400px', marginTop: '50px' }}
      ></div>
    </div>
  )
}
