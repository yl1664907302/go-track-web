import request from '@/axios'
import type {
  DelRecevier,
  DelRecevier_response,
  SelectMarkDownByStatus,
  SelectMarkDownByStatus_response,
  SelectReceivers_response,
  StepsFormType,
  StepsFormType_response,
  UserType,
  SelectMarkDownByStatus2Time_response,
  SelectMarkDownByStatus2Time,
  CreateRobot,
  CreateRobot_response,
  SelectRobot,
  SelectRobot_response,
  DelRobot,
  DelRobot_response,
  Updatemarkdowntemplate,
  Updatemarkdowntemplate_response,
  Selectmarkdowntemplate,
  Selectmarkdowntemplate_response,
  UpdateRobot,
  UpdateRobot_response
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

// 删除receiver
export const DelRecevierbyIndex = (
  params: DelRecevier
): Promise<IResponse<DelRecevier_response>> => {
  return request.delete({ url: '/alertmanger/del/index', params })
}

// 模糊查询

export const getmarkdownbystatus2time = (
  params: SelectMarkDownByStatus2Time
): Promise<IResponse<SelectMarkDownByStatus2Time_response>> => {
  return request.get({ url: '/alertmanger/markdownbystatus2mohu', params })
}

//创建机器人

export const postcreaterobot = (data: CreateRobot): Promise<IResponse<CreateRobot_response>> => {
  return request.post({ url: '/alertmanger/post/newrobot', data })
}

// 查询机器人

export const getrobots = (params: SelectRobot): Promise<IResponse<SelectRobot_response>> => {
  return request.get({ url: '/alertmanger/robot', params })
}

// 删除机器人
export const delrobots = (params: DelRobot): Promise<IResponse<DelRobot_response>> => {
  return request.delete({ url: '/alertmanger/delrobot', params })
}

// 更新机器人
export const updaterobots = (data: UpdateRobot): Promise<IResponse<UpdateRobot_response>> => {
  return request.post({ url: '/alertmanger/post/updaterobot', data })
}

// 更新markdown模板

export const updatemarktemplate = (
  data: Updatemarkdowntemplate
): Promise<IResponse<Updatemarkdowntemplate_response>> => {
  return request.post({ url: '/alertmanger/post/updatemarkdowntemplate', data })
}

// 查询模板
export const getmarktemplate = (
  params: Selectmarkdowntemplate
): Promise<IResponse<Selectmarkdowntemplate_response>> => {
  return request.get({ url: '/alertmanger/newmarkdowntemplate', params })
}
