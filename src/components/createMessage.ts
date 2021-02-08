import { createApp } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

/**
 * 创建Message组件，挂载到一个新节点上
 */
const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  //实例化组件
  const messageInstance = createApp(Message, {
    message,
    type
  })
  //创建一个新节点，挂载到新节点下
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeout)
}


export default createMessage