<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    />
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs">    
    </textarea>
    
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'

//检测email格式正则匹配规则
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: () => boolean;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea' //接收输入框类型

export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,  //接收子组件v-model传递的值
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  //设置子组件不继承父组件特性
  inheritAttrs: false,
  setup(props, context) {
    /**
     * v-bind="$attrs" 传入内部组件
     * 就是包含了所以父组件在子组件上设置的属性
     * （除了prop传递的属性、class 和 style ）
     */
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          //发送事件，更新子组件的v-model绑定的值
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    const validateInput = () => {
      if(props.rules) {
        /**
         * every 遍历数组，如果数组中检测到有一个元素不满足
         * 则整个表达式返回 false，且剩余的元素不会再进行检测。
         * 如果所有元素都满足条件，则返回 true。
         */
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch(rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    //组件装载后，发送form-item-created事件，将validateInput验证函数发送给父组件
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput
    }
  }
})
</script>

<style>

</style>