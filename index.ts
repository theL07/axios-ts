/*
 * @Description: 
 * @Author: theL07
 * @Date: 2022-06-14 19:35:15
 * @LastEditTime: 2022-06-14 20:13:57
 * @LastEditors: theL07
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const tokenKey = 'xxxx'
const baseURL = 'xxxxxxx'

// 取消重复请求
const pending: AxiosRequestConfig[] = []
const CancelToken = axios.CancelToken
// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key
    const list = pending[key]
    // 当前请求在数组中存在时执行函数
    if (list.url === config.url && list.method === config.method && JSON.stringify(list.params) === JSON.stringify(config.params) && JSON.stringify(list.data) === JSON.stringify(config.data)) {
      pending.splice(item, 1)
    }
  }
}
// 实例化请求配置
const instance = axios.create({
  baseURL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  // 表示跨域请求时是否需要使用凭证
  withCredentials: true
})

// 请求拦截
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    removePending(config)
    config.cancelToken = new CancelToken(() => {
      pending.push({ url: config.url, method: config.method, params: config.params, data: config.data })
    })
    config ??= {}
    config.headers ??= {}
    const token = localStorage.getItem(tokenKey) ?? ''

    config.headers.token = token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
instance.interceptors.response.use(
  async (config: AxiosResponse) => {
    removePending(config.config)
    if (config.status === 200) {
      if (config.data.msg === '未登录') {
        // 未登录处理
        localStorage.removeItem(tokenKey)
        return Promise.reject(config.data)
      }
      return Promise.resolve(config.data)
    } else {
      return Promise.reject(config.data)
    }
  },
  async error => {
    const { response } = error
    if (response) {
      const config = error.config
      const [RETRY_COUNT, RETRY_DELAY] = [3, 1000]
      if (config && RETRY_COUNT) {
        // 设置用于跟踪重试计数的变量
        config.__retryCount = config.__retryCount || 0
        // 检查是否已经把重试的总数用完
        if (config.__retryCount >= RETRY_COUNT) {
          return Promise.reject(response || { message: error.message })
        }
        // 增加重试计数
        config.__retryCount++
        // 创造新的Promise来处理指数后退
        const backoff = new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, RETRY_DELAY || 1)
        })
        // instance重试请求的Promise
        await backoff
        return await instance(config)
      }
    }
    return Promise.reject(error)
  }
)

export default instance