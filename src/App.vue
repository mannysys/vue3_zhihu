<template>
  <div class="container-fluid">

    <!-- 顶部导航 -->
    <div class="row">
      <global-header :user="currentUser"></global-header>
    </div>
    
    <Loader v-if="isLoading"></Loader>
    
    <message type="error" :message="error.message" v-if="error.status"></message>

    <router-view></router-view>

    <!-- 底部导航 -->
    <div class="row">
      <footer class="text-center py-4 text-secondary bg-light mt-6">
        <small>
          <ul class="list-inline mb-0">
            <li class="list-inline-item">@ 2021</li>
            <li class="list-inline-item">联系</li>
            <li class="list-inline-item">文档</li>
            <li class="list-inline-item">更多</li>
          </ul>
        </small>
      </footer>
    </div>

  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'
import axios from 'axios';
import { GlobalDataProps } from './store';

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    /**
     * computed计算函数，函数中访问的值改变了后，computed的值也会自动改变
     * 只要监听的那个数据改变，就会重新计算
     */
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)

    /**
     * 侦听的数据源error.value.status 发生变化后，就调用回调函数
     */
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })

    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>
<style>
</style>