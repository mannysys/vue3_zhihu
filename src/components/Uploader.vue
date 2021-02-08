<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" 
        :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input 
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean; //声明一个函数类型

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    },
    uploaded: {
      type: Object
    }
  },
  inheritAttrs: false,
  //声明发送给父组件的事件名称
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup(props, context) {
    //创建响应式变量
    //在setup中拿Dom节点，将响应式fileInput变量类型HTMLInputElement
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    //用于传递图片上传成功后返回的数据
    const uploadedData = ref(props.uploaded) 
    //处理用于异步返回图片数据
    watch(() => props.uploaded, (newValue) => {
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }
    })

    //点击按钮上传的时候，获取fileInput的DOM节点
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    //处理文件图片上传
    const handleFileChange = (e: Event) => {
      //获取到出发change事件的DOM节点
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        //将file对象转换成数组
        const files = Array.from(currentTarget.files)    

        //处理上传文件图片之前，调用检查函数（检查一些图片后缀格式）
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }

        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          //console.log(resp.data)
          fileStatus.value = 'success'
          uploadedData.value = resp.data
          //向父组件发送事件和数据
          context.emit('file-uploaded', resp.data)
        }).catch((error) => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', { error })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })

      }
    }

    return {
      fileInput,
      triggerUpload,
      fileStatus,
      uploadedData,
      handleFileChange
    }
  }
})

</script>
