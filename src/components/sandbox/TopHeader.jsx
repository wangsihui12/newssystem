import React from 'react'
import { Layout, theme, Dropdown, Space, Avatar } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons'
const { Header } = Layout
function TopHeader (props) {
  // console.log(props)
  const {
    role: { roleName },
    username
  } = JSON.parse(localStorage.getItem('token'))
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const items = [
    {
      key: '1',
      label: (
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.antgroup.com'
        >
          {roleName}
        </a>
      )
    },
    {
      key: '2',
      danger: true,
      label: (
        <div
          onClick={() => {
            localStorage.removeItem('token')
            props.history.replace('/login')
          }}
        >
          退出登录
        </div>
      )
    }
  ]

  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer
      }}
    >
      {React.createElement(
        props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
        {
          className: 'trigger',
          onClick: () => props.changeCollapsed()
        }
      )}
      <div style={{ float: 'right' }}>
        <span>
          欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来
        </span>
        <Dropdown
          menu={{
            items
          }}
        >
          <a onClick={e => e.preventDefault()}>
            <Space>
              <Avatar size='large' icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = state => {
  // console.log(state)
  return {
    isCollapsed: state.CollApsedReducer.isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed () {
    return {
      type: 'change_collasped'
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopHeader))
