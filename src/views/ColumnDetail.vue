<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img 
          :src="column.avatar && column.avatar.fitUrl" 
          :alt="column.title" 
          class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>

    <post-list :list="list"></post-list>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ColumnProps, GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
import { addColumnAvatar } from '../helper'

export default defineComponent({
  components: {
    PostList
  },

  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id

    //当组件挂载的时候触发
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    //专栏数据
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    }) 
    //专栏下文章列表数据
    const list = computed(() => store.getters.getPostsByCid(currentId))  

    return {
      column,
      list
    }
  }
})
</script>
