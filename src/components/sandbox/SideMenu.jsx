import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import './index.css'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
const { Sider } = Layout

function SideMenu (props) {
  // const iconList = {
  //   '/home': <PieChartOutlined />,
  //   '/user-manage': <MailOutlined />,
  //   '/user-manage/list': <AppstoreOutlined />
  // }
  // const items = [
  //   getItem('首页', '/home', <PieChartOutlined />),
  //   getItem('用户管理', '/user-manage', <MailOutlined />, [
  //     getItem('用户列表', '/user-manage/list'),
  //     getItem('添加用户', '/user-manage/add')
  //   ]),
  //   getItem('权限管理', '/right-manage', <AppstoreOutlined />, [
  //     getItem('角色列表', '/right-manage/role/list'),
  //     getItem('权限列表', '/right-manage/right/list'),
  //     getItem('修改角色', '/right-manage/role/update'),
  //     getItem('删除角色', '/right-manage/role/delete'),
  //     getItem('修改权限', '/right-manage/right/update'),
  //     getItem('删除权限', '/right-manage/right/delete')
  //   ]),
  //   getItem('新闻管理', '/news-manage', <AppstoreOutlined />, [
  //     getItem('新闻列表', '/news-manage/list'),
  //     getItem('撰写新闻', '/news-manage/add'),
  //     getItem('新闻更新', '/news-manage/update/:id'),
  //     getItem('新闻预览', '/news-manage/preview/:id'),
  //     getItem('草稿箱', '/news-manage/draft"'),
  //     getItem('新闻分类', '/news-manage/category')
  //   ]),
  //   getItem('审核管理', '/audit-manage', <AppstoreOutlined />, [
  //     getItem('审核列表', '/audit-manage/list'),
  //     getItem('审核新闻', '/audit-manage/audit')
  //   ]),
  //   getItem('发布管理', '/publish-manage', <AppstoreOutlined />, [
  //     getItem('待发布', '/publish-manage/unpublished'),
  //     getItem('已发布', '/publish-manage/published'),
  //     getItem('已下线', '/publish-manage/sunset')
  //   ])
  // ]

  // 动态获取侧边栏菜单
  const [menuItem, setMenuItem] = useState([])
  useEffect(() => {
    const {
      role: { rights }
    } = JSON.parse(localStorage.getItem('token'))
    const checkPagePermission = item => {
      return item.pagepermisson && rights.includes(item.key)
    }
    axios.get('/rights?_embed=children').then(res => {
      // console.log(res.data)
      var menuItem = []
      res.data.forEach(item => {
        // pagepermisson为菜单是否展示，1为展示，无pagepermisson值为不展示
        if (checkPagePermission(item)) {
          // 获取的数据列表内包含children的字段的为嵌套菜单
          if (item.children.length !== 0) {
            var childrenItem = []
            item.children.forEach(item2 => {
              if (checkPagePermission(item2)) {
                childrenItem = childrenItem.concat(
                  getItem(item2.title, item2.key, <AppstoreOutlined />)
                )
              }
            })
            menuItem = menuItem.concat(
              getItem(item.title, item.key, <AppstoreOutlined />, childrenItem)
            )
          } else {
            menuItem = menuItem.concat(
              getItem(item.title, item.key, <AppstoreOutlined />)
            )
          }
        }
        setMenuItem(menuItem)
      })
    })
  }, [])
  function getItem (label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type
    }
  }

  // 刷新后选中菜单高亮展开
  const [openKeys, setOpenKeys] = useState([])
  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    if (menuItem.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      {/* <div className='logo'>全球新闻发布管理系统</div> */}
      <div className='logo'>管理系统</div>
      <Menu
        theme='dark' // 主题颜色
        mode='inline'
        defaultSelectedKeys={['/home']} // 判断默认哪个目录为高亮,key为高亮值
        items={menuItem}
        onClick={e => {
          console.log(e)
          props.history.push(e.key)
        }}
        selectedKeys={[props.location.pathname]} // 判断刷新哪个目录为高亮,key为高亮值
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      />
    </Sider>
  )
}

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
  isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu))
