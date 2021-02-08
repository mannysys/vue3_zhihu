import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'

import App from './App.vue'


//开发环境和测试服环境区分开
// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 
// 'http://localhost:7001/api/' : 'http://api.vikingship.xyz/api/'

axios.defaults.baseURL = '/api/'
//拦截请求
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)  //请求时加载loading
  store.commit('setError', { status: false, message: '' })
  return config
})
//拦截响应
axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 1000)
  return config
}, e => {
  //拦截响应错误
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
//http://api.vikingship.xyz/api/columns
// axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 请求接口url后设置参数
// axios.interceptors.request.use(config => {
//   config.params = { ...config.params, icode: 'C6A6C4086133360B' }
//   return config
// })
// axios.get('/columns', { params: { key: 'hello' } }).then(resp => {
//   console.log(resp.data)
// })


const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')