import request from '@/axios'
import type {
  SelectMarkDownByStatus,
  SelectMarkDownByStatus_response,
  SelectReceivers_response,
  StepsFormType,
  StepsFormType_response,
  UserType
} from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}

// 提交分步表单
export const poststepsform = (data: StepsFormType): Promise<IResponse<StepsFormType_response>> => {
  return request.post({ url: '/alertmanger/post/stepform', data })
}

// 获取所有的receiver
export const getreceivers = (): Promise<IResponse<SelectReceivers_response>> => {
  return request.get({ url: '/alertmanger/receivers' })
}

// 获取markdownbystatus
export const getmarkdownbystatus = (
  params: SelectMarkDownByStatus
): Promise<IResponse<SelectMarkDownByStatus_response>> => {
  return request.get({ url: '/alertmanger/markdownbystatus', params })
}
