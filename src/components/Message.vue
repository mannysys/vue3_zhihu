<template>
  <teleport to="#message">
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      :class="classObject" v-if="isVisible">
      <span>{{ message }}</span>
      <button type="button" class="btn-close" aria-label="Close" 
        @click.prevent="hide">
        <!-- <span aria-hidden="true">&times;</span> -->
      </button>
    </div>    
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onUnmounted } from 'vue'
import useDOMCreate from "../hooks/useDOMCreate"

export type MessageType = 'success' | 'error' | 'default'

export default defineComponent({
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup(props, context) {
    //创建一个html节点，将loading组件传过去
    useDOMCreate('message')
   
    const isVisible = ref(true)
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    //触发点击事件
    const hide = () => {
      isVisible.value = false
      context.emit('close-message', true) //向父组件传递事件
    }

    return {
      classObject,
      isVisible,
      hide
    }
    //当组件卸载时删除掉该节点
    // onUnmounted(() => {
    //   document.body.removeChild(node)
    // })
  }
})
</script>