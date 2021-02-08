<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>

    <h4 class="font-weight-bold text-center">发现精彩</h4>
    
    <column-list :list="list"></column-list>

    <button
      class="btn btn-outline-danger mt-2 mb-5 btn-block w-25 mx-auto"
       @click="loadMorePage" v-if="!isLastPage" >
      加载更多
    </button>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import useLoadMore from "../hooks/useLoadMore";
import ColumnList from '../components/ColumnList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    //获取到总共多少条数据
    const total = computed(() => store.state.columns.total)
    const currentPage = computed(() => store.state.columns.currentPage)

    //调用生命周期钩子函数onMounted，组件挂载的时候触发
    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3 }) //触发store里的Action函数
    })

    //计算属性（只要监听的数据改变就会重新计算）
    const list = computed(() => store.getters.getColumns)
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, 
    { pageSize: 3, currentPage: (currentPage.value ? currentPage.value + 1 : 2) })

    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
<style>

</style>