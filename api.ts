/*
 * @Description: axios 请求
 * @Author: theL07
 * @Date: 2022-06-14 20:08:34
 * @LastEditTime: 2022-06-14 20:11:42
 * @LastEditors: theL07
 */
import {
  get,
  post,
  postForm
} from 'request'

const getUserInfo = <T>(params: T) => {
  return get('/user/info', params)
}

const login = <T>(params: T) => {
  return post('/user/login', params)
}

const postFormLog = <T>(params: T) => {
  return postForm('/log/countly', params)
}

export {
  getUserInfo,
  login,
  postFormLog
}