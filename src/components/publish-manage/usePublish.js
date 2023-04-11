import { message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
function usePublish (type) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then(res => {
        // console.log(res.data)
        setDataSource(res.data)
      })
  }, [username, type])

  //   发布
  const handlePublish = id => {
    console.log(id)

    setDataSource(dataSource.filter(item => item.id !== id))
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now()
      })
      .then(res => {
        message.success('发布成功')
      })
  }
  //   下线
  const handleSunset = id => {
    console.log(id)
    setDataSource(dataSource.filter(item => item.id !== id))
    axios
      .patch(`/news/${id}`, {
        publishState: 3
      })
      .then(res => {
        message.success('下线成功')
      })
  }
  // 删除
  const handleDelete = id => {
    console.log(id)
    setDataSource(dataSource.filter(item => item.id !== id))
    axios
      .delete(`/news/${id}`, {
        publishState: 1
      })
      .then(res => {
        message.success('删除成功')
      })
  }

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}

export default usePublish
