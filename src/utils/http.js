import axios from 'axios'
import { store } from '../redux/store'

// function ajax () {
// 取数据 get
// axios.get('http://localhost:8000/posts?_page=1&_limit=5').then(res => {
//   console.log(res.data)
// })
// 增加数据 post
// axios.post('http://localhost:8000/posts', {
//   title: '56',
//   author: '张三'
// })
// 修改 put
// axios.put('http://localhost:8000/posts/3', {
//   title: '测试1',
//   author: '测试人员1'
// })
// 修改 patch
// axios.patch('http://localhost:8000/posts/2', {
//   title: '测试2'
// })
// 删除 delete
// axios.delete('http://localhost:8000/posts/2')
// _embed向下关联
// axios.get('http://localhost:8000/posts?_embed=comments').then(res => {
//   console.log(res.data)
// })
// expand 向上关联
// axios
//   .get('http://localhost:8000/comments?_expand=post')
//   .then(res => console.log(res.data))
// }

axios.defaults.baseURL = 'http://localhost:3000'

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 显示loading
    store.dispatch({
      type: 'change_loading',
      payload: true
    })
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 隐藏loading
    store.dispatch({
      type: 'change_loading',
      payload: false
    })
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 隐藏loading
    store.dispatch({
      type: 'change_loading',
      payload: false
    })
    return Promise.reject(error)
  }
)
