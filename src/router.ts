import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'
import store from './store'


// 路由实例化
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { redirectAlreadyLogin: true }
    },    
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true } //在路由上添加元信息
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    }    
  ]
})

//全局的前置 导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to.meta)
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.log(e)
        store.commit('logout')
        next('login')
      })  

    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }

  } else {
    //如果没有登录就跳到登录界面
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }

  
  // next(false) 停止继续路由
})

export default router