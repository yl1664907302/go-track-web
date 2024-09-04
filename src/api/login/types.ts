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
