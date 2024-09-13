export type UserLoginType = {
  username: string
  password: string
}

export type UserType = {
  username: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}

// 分步表单
export type StepsFormType = {
  niname: string
  robot_name: string
  receiver: string
  robot_class: string
  switch: boolean
  accesstoken: string
  secret: string
  robot_ok: boolean
  markdown_ok: boolean
  markdown: string
}

export type StepsFormType_response = {
  status: any
  message: any
}

// 查询receivers

export type SelectReceivers_response = {
  niname: string
  receiver_name: string
  mnumber_firing: number
  mnumber_resolved: number
}[]

// 获取指定消息数量
export type SelectMarkDownByStatus = {
  index: string
  status: string
}

export type SelectMarkDownByStatus_response = {
  markdowns: any
  number: number
  status: string
}

// 删除recevier
export type DelRecevier = {
  index: string
}

export type DelRecevier_response = {
  status: string
  message: any
}

// 模糊查询
export type SelectMarkDownByStatus2Time = {
  index: any
  status: any
  time_start: string
  time_end: string
}

export type SelectMarkDownByStatus2Time_response = {
  markdowns: Markdowns[]
  number: number
  status: string
}

export type Markdowns = {
  status: string
  zhiwen: string
  time: string
  markdown: string
}
