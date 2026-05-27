import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200) {
      return data.data
    } else {
      console.error('请求失败:', data.message)
      return Promise.reject(data)
    }
  },
  (error) => {
    console.error('网络错误:', error.message)
    return Promise.reject(error)
  }
)

export const request = (config) => {
  return instance(config)
}

export const get = (url, params = {}, config = {}) => {
  return instance.get(url, { params, ...config })
}

export const post = (url, data = {}, config = {}) => {
  return instance.post(url, data, config)
}

export const put = (url, data = {}, config = {}) => {
  return instance.put(url, data, config)
}

export const del = (url, params = {}, config = {}) => {
  return instance.delete(url, { params, ...config })
}

export default instance