<template>
  <div class="container">
    <Validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          type="text"
          placeholder="请输入邮箱地址"
          :rules="emailRules" v-model="emailVal"/>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules" v-model="passwordVal"/>
      </div>
      
      <!-- 将以下按钮插入到我们定义的父组件Validate-form里的submit插槽 -->
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
      </template>

    </Validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name:'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    //实例化路由和store对象
    const router = useRouter()
    const store = useStore()

    //声明的变量变为响应式，设置表单里字段邮件和密码属性成双项绑定
    const emailVal = ref('')   
    const passwordVal = ref('') 

    //定义一个我自定义的RulesProp类型数组，做字段值校验规则匹配
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮件地址不能为空'},
      { type: 'email', message: '请输入正确的电子邮箱格式'}
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空'}
    ]

    //处理表单提交验证通过
    const onFormSubmit = (result: boolean) => {
      // console.log('result', result)
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        //请求用户登录
        store.dispatch('loginAndFetch', payload).then(data => {
          // console.log(data)
          createMessage('登录成功 2秒后跳转首页', 'success')
          setTimeout(() => {
            router.push('/') //跳转首页
          }, 2000)
        }).catch(e => {
          console.log('异常错误：' + e)
        })
      }
    }
    return {
      emailRules,
      emailVal,
      passwordRules,
      passwordVal,
      onFormSubmit
    }
  }
})
</script>

<style>

</style>