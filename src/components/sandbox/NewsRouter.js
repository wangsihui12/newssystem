import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user_manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux'
const LocalRouterMap = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/category': NewsCategory,
  '/news-manage/preview/:id': NewsPreview,
  '/news-manage/update/:id': NewsUpdate,
  '/audit-manage/audit': Audit,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset
}

function NewsRouter (props) {
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([axios.get('/rights'), axios.get('/children')]).then(res => {
      //   console.log(res)
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])
  const {
    role: { rights }
  } = JSON.parse(localStorage.getItem('token'))
  function checkRoute (item) {
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    )
  }
  function checkUserPermisson (item) {
    return rights.includes(item.key)
  }
  return (
    <div>
      <Spin size='large' spinning={props.isLoading}>
        <Switch>
          {BackRouteList.map(item => {
            if (checkRoute(item) && checkUserPermisson(item)) {
              return (
                <Route
                  path={item.key}
                  key={item.key}
                  component={LocalRouterMap[item.key]}
                  exact
                />
              )
            }
            return null
          })}
          {/* 重定向 exact精确查找路径 */}
          <Redirect from='/' to='/home' exact />
          {/* 没有查找到输入的路径，则展示NoPermission页面 */}

          {BackRouteList.length > 0 && (
            <Route path='*' component={NoPermission} />
          )}
        </Switch>
      </Spin>
    </div>
  )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({ isLoading })

export default connect(mapStateToProps)(NewsRouter)
