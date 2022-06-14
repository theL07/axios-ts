/*
 * @Description: 封装axios中的get、post等方法
 * @Author: theL07
 * @Date: 2022-06-14 19:56:45
 * @LastEditTime: 2022-06-14 20:09:22
 * @LastEditors: theL07
 */
import axios from './index'
import qs from 'qs'

export const get = <T>(url: string, params?: T): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const post = <T>(url: string, params?: T): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params)).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const postForm = <T>(url: string, params?: T): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}