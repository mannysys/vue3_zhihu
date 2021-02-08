import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helper'

//请求API 响应的数据结构，data声明为泛型
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}

// 用户数据结构
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

//专栏数据结构
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

//文章数据结构
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;  //摘要
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}

//定义一个泛型
interface ListProps<P> {
  [id: string]: P;
}
//响应数据结构
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

//全局数据结构类型声明
export interface GlobalDataProps {
  token: string;
  error: GlobalErrorProps;
  loading: boolean;
  columns: { data: ListProps<ColumnProps>; currentPage: number; total: number };
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
  user: UserProps;
}

//封装请求GET接口函数
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data) //提交数据给状态state
  return data
}
//封装请求POST接口函数
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
/**
 * AxiosRequestConfig请求参数的配置类型 
 * 封装请求函数
 */
const asyncAndCommit = async(url: string, mutationName: string, 
  commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  //初始化state状态
  state: {
    token: localStorage.getItem('token') || '',
    error: { status: false },
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data:{}, loadedColumns: [] },
    user: { isLogin: false }
  },
  //触发事件方法，负责更新state状态数据（mutations同步执行）
  mutations: {
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking' }
    // },
    //新添加文章
    createPost(state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    //更新state数据 专栏列表
    fetchColumns(state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    //更新state数据 专栏文章列表
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    //更新state数据 文章详情内容
    fetchPosts(state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id]
    },
    //更新文章状态数据
    updatePost(state, { data }) {
      state.posts.data[data._id] = data
    },
    //设置loading 当前状态
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    //当前登陆的用户信息
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    //设置用户登陆校验成功后获得的令牌token
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      //存储token
      localStorage.setItem('token', token)
      //设置请求头部验证token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    //用户退出
    logout(state) {
      state.token = ''
      localStorage.remove('token')
      delete axios.defaults.headers.common.Authorization
    }
  },

  //actions内部执行异步操作
  actions: {
    //请求获取专栏列表
    //展开context对象中的参数commit的，或者 context.commit
    fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
      // if (!state.columns.isLoaded) {
      //   return asyncAndCommit('/columns', 'fetchColumns', commit)
      // }
      //const { data } = await axios.get('/columns')
      //commit('fetchColumns', data) //提交数据给状态state
    },
    //请求专栏下文章列表
    fetchColumn({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    //请求获取文章详情内容
    fetchPosts({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchPosts', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    //文章更新
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    //请求当前登陆用户的信息
    fetchCurrentUser({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    //用户登陆
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    //创建文章
    createPost({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', commit, payload)
    },
    //用户登陆请求 和 用户信息请求
    loginAndFetch({ dispatch }, loginData) {
      //触发事件
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }

  },

  //getters其实是store的计算属性（对state里面的状态数据做逻辑处理）
  getters: {
    // biggerColumnsLen(state) {
    //   return state.columns.filter(c => c.id > 2).length
    // },
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    //传参，返回函数
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  }
})

export default store