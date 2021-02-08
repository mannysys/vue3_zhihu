<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border border-light my-3" >
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-left">{{ column.description }}</p>
          <!-- :to="{name: 'column', params: {id: column.id}}" -->
          <router-link 
            :to="`/column/${column._id}`"
            class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 内容列表组件
 */
import { computed, defineComponent, PropType } from 'vue'
import { ColumnProps } from '../store'

export default defineComponent({
  name: 'ColumnList',
  props: {
    // 声明接收父组件传递过来的数据类型
    list: {
      type: Array as PropType<ColumnProps[]>,//转换我们自定义的ColumnProps类型
      required: true
    }
  },
  setup(props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        //如果没有传头像地址就设置成默认头像地址
        if(!column.avatar) {
          column.avatar = { url: require('@/assets/logo.png') }
        } else {
          //设置阿里云图片云存储的缩放url参数
          column.avatar.url = column.avatar.url + '?x-oss-process=image/resize,m_pad,h_50,w_50'
        }
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>

<style scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
</style>