import axios, { AxiosResponse } from 'axios'
import { IDataRequest } from './types'
// This realisation have problem. It doesn't work with any types except application/json

export const putData = async (url: string, body: object): Promise<any> => {
  const request: IDataRequest = {
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    url,
  }

  const response: AxiosResponse = await axios(request)
  return response
}

export const getData = async (url: string): Promise<any> => {
  const request: IDataRequest = {
    method: 'GET',
    url,
  }

  const response: AxiosResponse = await axios(request)
  return response
}

export const postData = async (url: string, body: object): Promise<any> => {
  const request: IDataRequest = {
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    url,
  }

  const response: AxiosResponse = await axios(request)
  return response
}

export const deleteData = async (url: string): Promise<any> => {
  const request: IDataRequest = {
    method: 'DELETE',
    url,
  }

  const response: AxiosResponse = await axios(request)
  return response
}

export const checkSSL = (message: string, url: string): boolean => {
  if (message.toLowerCase() === 'network error') {
    window.open(url, '_blank')
    return true
  }
  return false
}
