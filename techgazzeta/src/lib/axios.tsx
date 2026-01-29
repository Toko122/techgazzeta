import axios, { InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
    baseURL: ''
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null
      if(token){
        (config.headers as any)['Authorization'] = `Bearer ${token}`
      }
      return config
})

export default instance