import { ref, onMounted, onUnmounted, Ref } from 'vue'

/**
 * 在dom节点上绑定点击事件，点击网页中任意位置可触发（除了dropdown下拉菜单位置不触发）
 * @param elementRef 接收Dom节点元素
 */
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  //装载该组件的时候，给元素上添加点击事件
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  //卸载该组件的时候，删除元素上点击事情
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })

  return isClickOutside
}

export default useClickOutside

