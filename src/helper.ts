import { ColumnProps, ImageProps, UserProps } from './store'

/**
 * 
 * @param data 
 * @param width 
 * @param height 
 * @param format 
 */
export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}



/**
 * 检查上传的图片格式和大小 
 */
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'size' | 'format' | null

export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}



//
interface TestProps {
  _id: string;
  name: string;
}
// const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]

/**
 * 将数组转换成对象
 * reduce 函数接收2个参数
 * 第一参数是函数，有2个参数 prev表示上一次调用回调时的返回值，current表示当前正在处理的数组元素
 * 第二参数是初始值空对象{}，as 是断言空对象的类型
 * <T extends { _id?: string }> 约束定义的泛型，可能有这个_id的类型是字符串string类型
 */
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current

    }
    return prev
  }, {} as { [key: string]: T })
}
// const result = arrToObj(testData)
// console.log(result)

/**
 * 将对象转换成数组
 */
export const objToArr = <T>(obj: {[key: string]: T}) => {
  return Object.keys(obj).map(key => obj[key])
}
