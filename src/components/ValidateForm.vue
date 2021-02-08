<template>
  <form action="" class="validate-form-container">
    
    <!-- 表单插槽，默认传入的区域 -->
    <slot name="default"></slot>

    <div class="submit-area" @click.prevent="submitForm">
     
      <!-- 提交按钮插槽submit，如果该插槽没有传入组件，就渲染以下默认的button按钮 -->
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>

    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'

// 实例化 mitt
export const emitter = mitt()
type ValidateFunc = () => boolean

export default defineComponent({
  emits: ['form-submit'], 
  setup(props, context) {
    let funcArr: ValidateFunc[] = []

    //表单提交事件
    const submitForm = () => {
      //遍历数组中所有子组件传递过来的函数，遍历一个函数执行一个函数
      //将函数返回结果返回给变量
      const result = funcArr.map(func => func()).every(result => result)
      //将form-submit事件发送给子组件
      context.emit('form-submit', result)
    }

    // 将监听得到的验证函数都存到一个数组中
    const callback = (func?: ValidateFunc) => {
      if(func) {
        funcArr.push(func)
      }
    }
    //添加监听，定义一个form-item-created事件监听器
    emitter.on('form-item-created', callback)
    //组件卸载的时候，清理事件监听器
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })

    return {
      submitForm
    }
  }

})
</script>

<style>

</style>