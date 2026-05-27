import { get, post } from '@/utils/axios'

export const fetchData = (params) => {
  return get('/api/data', params)
}

export const submitData = (data) => {
  return post('/api/submit', data)
}