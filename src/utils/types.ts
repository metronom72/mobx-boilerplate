export interface IDataRequest {
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: any
  data?: any
  url: string
}

export const notImplemented = () => {
  // tslint:disable-next-line: no-console
  console.warn('Метод не реализован')
}

export const notInit = () => {
  throw new Error('Не инициализированно корректно')
}
