import { onUnmounted } from 'vue'

function useDOMCreate(nodeId: string) {
    //创建一个html节点，将loading组件传过去
    const node = document.createElement('div')
    node.id = nodeId
    document.body.appendChild(node)
    //当组件卸载时删除掉该节点
    onUnmounted(() => {
      document.body.removeChild(node)
    })
}

export default useDOMCreate