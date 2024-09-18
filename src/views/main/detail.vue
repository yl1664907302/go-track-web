<template>
  <div class="container">
    <div class="card-container">
      <el-card class="box-card1">
        <template #header>
          <div>
            <span>消息模块：{{ niname }}<br />当前分类：{{ state }}</span>
            <div class="button-container">
              <el-button @click="changeAlertClass()" class="button" type="primary">
                切换消息分类</el-button
              >
            </div>
          </div>
        </template>
        <div class="block">
          <span class="demonstration">选择消息查询的时间范围</span>
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            :default-time="defaultTime2"
          />
        </div>
        <el-scrollbar height="600px">
          <div class="demo-collapse">
            <el-collapse v-model="activeNames">
              <el-collapse-item
                v-for="(item, index) in collapseItems"
                :key="index"
                :title="'触发时间：' + item.title"
                :name="item.num"
              >
                <div v-html="renderMarkdown(item.content)"> </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-scrollbar>
      </el-card>
      <el-card class="box-card2">
        <template #header>
          <div class="card-header">
            <span> 消息模板更新/创建</span>
          </div>
        </template>
        <el-form ref="formRef2" :model="markdown_template" label-width="auto">
          <el-form-item
            prop="desc.markdown"
            label="模板"
            v-model="markdown_template_desc.markdown"
            :rules="[{ required: true, message: '必填项' }]"
          >
            <el-input rows="31" v-model="markdown_template.desc.markdown" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update_markdown" style="margin-left: 40%"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card3">
        <template #header>
          <div>
            <span>机器人列表</span>
          </div>
        </template>
        <el-scrollbar style="height: 300px">
          <div class="demo-collapse2">
            <el-collapse v-model="activeNames_1">
              <el-collapse-item
                v-for="(item, index) in collapseItems_robot"
                :key="index"
                :title="'机器人名称：' + item.robot_name"
                :name="item.robot_id"
              >
                <template #title>
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <span>机器人名称：{{ item.robot_name }}</span>
                    <el-button type="primary" size="mini" @click="centerDialogVisible = true">
                      删除
                    </el-button>
                    <el-button type="primary" size="mini" @click="centerDialogVisible2 = true">
                      修改
                    </el-button>
                  </div>
                </template>
                <div>{{ item }} </div>
                <el-dialog v-model="centerDialogVisible" title="警告" width="30%" center>
                  <span>你确定要删除此robot吗</span>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="centerDialogVisible = false">取消</el-button>
                      <el-button
                        type="primary"
                        @click="del_robot(item.robot_id), (centerDialogVisible = false)"
                        >确定</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
                <el-dialog v-model="centerDialogVisible2" title="提示" width="30%" center>
                  <el-form
                   ref="ruleFormRef"
                   v-loading="loading"
                    v-if="item.robot_class == dingtalk"
                    :model="robot"
                    label-width="auto"
                  >
                    <el-form-item
                      prop="robot_name"
                      label="昵称"
                      :rules="[{ required: true, message: '必填项' }]"
                    >
                      <el-input v-model="robot.robot_name" />
                    </el-form-item>

                    <el-form-item v-model="robot.switch" prop="switch" label="启用">
                      <el-switch v-model="robot.switch" />
                    </el-form-item>
                    <el-form-item
                      prop="accesstoken"
                      label="token"
                      :rules="[{ required: true, message: '必填项' }]"
                    >
                      <el-input v-model="robot.accesstoken" />
                    </el-form-item>
                    <el-form-item
                      prop="secret"
                      label="secret"
                      :rules="[{ required: true, message: '必填项' }]"
                    >
                      <el-input v-model="robot.secret" />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="centerDialogVisible2 = false">取消</el-button>
                      <el-button
                        type="primary"
                        @click="
                          update_robot(item.robot_id, item.robot_class,ruleFormRef),
                            (centerDialogVisible2 = false)
                        "
                        >更新</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-scrollbar>
      </el-card>
      <el-card class="box-card4">
        <template #header>
          <div class="card-header">
            <span>robot列表/创建</span>
          </div>
        </template>
        <el-form ref="formRef" :model="form" label-width="auto">
          <el-form-item
            prop="robot_name"
            label="昵称"
            :rules="[{ required: true, message: '必填项' }]"
          >
            <el-input v-model="form.robot_name" />
          </el-form-item>
          <el-form-item
            prop="robot_class"
            label="类型"
            :rules="[{ required: true, message: '必填项' }]"
          >
            <el-select v-model="form.robot_class" placeholder="请选择你的webhook类型">
              <el-option label="钉钉" value="dingtalk" />
            </el-select>
          </el-form-item>
          <el-form-item prop="switch" label="启用">
            <el-switch v-model="form.switch" />
          </el-form-item>
          <el-form-item
            prop="accesstoken"
            label="token"
            :rules="[{ required: true, message: '必填项' }]"
          >
            <el-input v-model="form.accesstoken" type="textarea" />
          </el-form-item>
          <el-form-item prop="secret" label="密钥" :rules="[{ required: true, message: '必填项' }]">
            <el-input v-model="form.secret" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit_robot_create" style="margin-left: 40%"
              >创建</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, onMounted, reactive, h } from 'vue'
import {
  getmarkdownbystatus2time,
  postcreaterobot,
  getrobots,
  delrobots,
  updatemarktemplate,
  getmarktemplate,
  updaterobots
} from '@/api/login'
import {
  SelectMarkDownByStatus2Time,
  SelectRobot,
  Robot,
  DelRobot,
  Updatemarkdowntemplate,
  desc,
  Selectmarkdowntemplate,
} from '@/api/login/types'
import { marked } from 'marked'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import type { FormInstance } from 'element-plus'
const dingtalk = 'dingtalk'
const centerDialogVisible = ref(false)
const centerDialogVisible2 = ref(false)
const loading = ref(false)
// 获取路由参数
const route = useRoute()
const niname = route.query.niname
const receiver = route.query.receiver
let state = route.query.state
const formRef = ref<FormInstance>()
const formRef2 = ref<FormInstance>()
const ruleFormRef = ref<FormInstance>()
// 获取今天的日期
const today = new Date()

// 设置 startDate 为今天的 00:00:00
const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)

// 设置 endDate 为今天的 23:59:59
const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

const value2 = ref<[Date, Date]>([startDate, endDate])

// 默认时间设置
const defaultTime2 = [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)]

// el-collapse 的 activeNames
const activeNames = ref(['1'])
const activeNames_1 = ref(['1'])
// 处理 collapse 的切换事件
// const handleChange = (val: string[]) => {
//   console.log(val)
// }

// 创建路由需要此作用域
const router = useRouter()
const reloadPage = (s: string) => {
  // loading.value=!loading.value
  setTimeout(() => {
    // loading.value=false
    router.replace({
      path: '/alertmanger/status',
      query: {
        niname: niname as string,
        receiver: receiver as string,
        state: s as string,
        date: new Date().getTime()
      }
    })
  }, 800)
}

// markdown转换
marked.setOptions({
  gfm: true,
  breaks: true
})
const renderMarkdown = (markdownText: string) => {
  return marked(markdownText)
}

// 数据源，包含每个 el-collapse-item 的 title 和内容
const collapseItems = ref<any[]>([])

// 获取 markdown 数据的函数
const getmarkdown = (i: string, s: string, t1: string, t2: string) => {
  const params: SelectMarkDownByStatus2Time = {
    index: i,
    status: s,
    time_start: t1,
    time_end: t2
  }

  getmarkdownbystatus2time(params)
    .then((resp) => {
      let i = 1
      // 假设 resp.data.markdowns 是一个数组，包含多个 markdown 项
      collapseItems.value = resp.data.markdowns.map((item: any) => ({
        name: item.status, // 例如，用 status 作为 name
        title: item.time, // 用 zhiwen 作为 title
        content: item.markdown, // markdown 内容
        num: i++ //配置折叠面板的id，变更事情时打开点击的页面
      }))
    })
    .finally(() => {
      console.log(collapseItems)
    })
}

// 监听日期选择器的值，当 value2 发生变化时获取开始和结束时间
watch(value2, (newVal) => {
  if (newVal) {
    const [start, end] = newVal
    getmarkdown(receiver as string, state as string, start.toISOString(), end.toISOString())
  }
})

//切换分类事件
const changeAlertClass = () => {
  let s: string
  if ((state as string) == 'firing') {
    s = 'resolved'
  } else {
    s = 'firing'
  }
  reloadPage(s)
}

// 表单创建机器人
const form = reactive({
  receiver: receiver as string,
  robot_name: '',
  robot_class: '',
  switch: false,
  accesstoken: '',
  secret: ''
})

const response_1 = reactive({
  status: '',
  message: ''
})

const onSubmit_robot_create = () => {
  var s: string = ''
  formRef.value?.validate((valid) => {
    if (valid) {
      postcreaterobot(form)
        .then((resp) => {
          response_1.message = resp.data.message
          response_1.status = resp.data.status
          if ((state as string) == 'firing') {
            s = 'firing'
          } else {
            s = 'resolved'
          }
        })
        .catch((error) => {
          console.error('请求发生错误:', error)
        })
        .finally(() => {
          alert()
          reloadPage(s)
        })
    }
  })
}

// 查询robot
let collapseItems_robot = ref<Robot[]>()

const select_robots = () => {
  const select_robots_params: SelectRobot = {
    index: receiver as string
  }
  getrobots(select_robots_params)
    .then((resp) => {
      // resp.data.robots.forEach((robot,i)=>{
      //   collapseItems_robot[i]=robot
      // })
      collapseItems_robot.value = resp.data.robots
    })
    .catch((error) => {
      console.error('请求发生错误:', error)
    })
}

// 删除机器人
const del_robot = (id: number) => {
  var s: string = ''
  const d: DelRobot = {
    index: receiver as string,
    robot_id: id
  }
  delrobots(d)
    .then((resp) => {
      response_1.status = resp.data.status
      response_1.message = resp.data.message
      if (resp.code === 0) {
        if ((state as string) == 'firing') {
          s = 'firing'
          alert()
        } else {
          s = 'resolved'
          alert()
        }
        reloadPage(s)
      }
    })
    .catch((error) => {
      console.error('请求发生错误:', error)
    })
}

// 更新机器人
const robot= reactive({
  robot_id: 0,
  robot_name: '',
  receiver: '',
  robot_class: '',
  switch: false,
  accesstoken: '',
  secret: ''
})

const update_robot =  async (id: number, c: string,formEl:FormInstance|undefined) => {
  // debugger
  // if (!formEl) return
  var s: string = ''
  // await formEl.validate((valid) => {
  //   if (valid) {
      robot.robot_id = id
      robot.receiver = receiver as string
      robot.robot_class = c
      updaterobots(robot)
        .then((resp) => {
          response_1.message = resp.data.message
          response_1.status = resp.data.status
          if ((state as string) == 'firing') {
            s = 'firing'
          } else {
            s = 'resolved'
          }
        })
        .catch((error) => {
          console.error('请求发生错误:', error)
        })
        .finally(() => {
          loading.value=true
          // setTimeout(()=>{
          //   loading.value=false
          // },800)
          alert()
          reloadPage(s)
        })
    }
// }

// 更新模板
const markdown_template_desc: desc = reactive({
  maketime: '',
  markdown: ''
})

const markdown_template: Updatemarkdowntemplate = reactive({
  receiver: receiver as string,
  desc: markdown_template_desc
})

const update_markdown = () => {
  var s: string = ''
  formRef2.value?.validate((valid) => {
    if (valid) {
      updatemarktemplate(markdown_template)
        .then((resp) => {
          response_1.message = resp.data.message
          response_1.status = resp.data.status
          if ((state as string) == 'firing') {
            s = 'firing'
          } else {
            s = 'resolved'
          }
        })
        .catch((error) => {
          console.error('请求发生错误:', error)
        })
        .finally(() => {
          alert()
          reloadPage(s)
        })
    }
  })
}

//查询模板
const select_markdown = () => {
  const select_robots_params: Selectmarkdowntemplate = {
    index: receiver as string
  }
  getmarktemplate(select_robots_params)
    .then((resp) => {
      markdown_template_desc.markdown = resp.data.desc.markdown
    })
    .catch((error) => {
      console.error('请求发生错误:', error)
    })
}

// 弹窗消息
const alert = () => {
  let type_1 = ''
  let title_1 = ''
  if (response_1.status === 'error') {
    type_1 = 'error'
    title_1 = '创建失败'
  } else {
    type_1 = 'success'
    title_1 = '创建成功'
  }

  ElNotification({
    title: title_1,
    message: h('i', { style: 'color: teal' }, response_1.message),
    position: 'top-right',
    type: type_1
  })
}

// 在组件挂载时调用 getmarkdown，加载默认时间范围的数据
onMounted(() => {
  const [start, end] = value2.value
  select_robots()
  select_markdown()
  getmarkdown(receiver as string, state as string, start.toISOString(), end.toISOString())
})
</script>

<style scoped>
.container {
  display: grid;
  flex-wrap: wrap;
  gap: 20px;
  /* 卡片之间的间距 */
  padding: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-between;
  /* 在容器内的卡片之间创建间距 */
  flex-wrap: wrap;
  /* 使卡片能够在行末换行 */
  gap: 20px;
  /* 卡片之间的间距 */
}

.box-card1,
.box-card2,
.box-card3,
.box-card4 {
  /* 卡片最小宽度为300px，根据需要调整 */
  max-width: 100%;
  box-sizing: border-box;
}

.box-card1 {
  height: 800px;
  grid-row: span 2; /* 让第一卡片跨越两行 */
}

.box-card2 {
  height: 800px;
  grid-row: span 2;
}
.box-card3 {
  height: 375px;
  grid-column: 3; /* 指定位置在第二列 */
  grid-row: 1;
}

.box-card4 {
  height: 400px;
  grid-column: 3; /* 指定位置在第二列 */
  grid-row: 2; /* 指定行在第二行 */
}

.button-container {
  margin-left: auto;
  /* 将按钮推到右边 */
  margin-top: auto;
}
</style>
