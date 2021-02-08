<template>
  <div class="dropdown" ref="dropdownRef">
    <a @click.prevent="toggleOpen" href="#" class="btn btn-outline-light my-2 dropdown-toggle">
      {{title}}
    </a>
    <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
/**
 * 下拉菜单组件
 */
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    //控制下拉菜单显示和隐藏
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }

    //当Dropdown组件挂载的时候使用ref属性，就可以接收到dom节点（设置成联合类型）
    const dropdownRef = ref<null | HTMLElement>(null)
    //在dom节点上绑定点击事件
    const isClickOutside = useClickOutside(dropdownRef)
    //使用watch监听 isClickOutside响应式的变化
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })
    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>
