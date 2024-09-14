<template>
  <el-row>
    <el-col>
      <el-space>
        <el-card class="box-card1">
          <template #header>
            <div class="card-header">
              <span>消息模块：{{ niname }}<br />当前分类：{{ state }}</span>
              <el-button
                @click="changeAlertClass()"
                class="button"
                type="primary"
                style="margin-top: -55px; margin-left: 450px"
                >切换消息分类</el-button
              >
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
      </el-space>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { getmarkdownbystatus2time } from '@/api/login'
import { SelectMarkDownByStatus2Time } from '@/api/login/types'
import { marked } from 'marked'
import { useRouter } from 'vue-router'
// 获取路由参数
const route = useRoute()
const niname = route.query.niname
const receiver = route.query.receiver
let state = route.query.state

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

// 处理 collapse 的切换事件
// const handleChange = (val: string[]) => {
//   console.log(val)
// }

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
// 创建路由需要此作用域
const router = useRouter()
const reloadPage = (s: string) => {
  router.push({
    path: '/alertmanger/status',
    query: {
      niname: niname as string,
      receiver: receiver as string,
      state: s as string
    }
  })
}

// 在组件挂载时调用 getmarkdown，加载默认时间范围的数据
onMounted(() => {
  const [start, end] = value2.value
  getmarkdown(receiver as string, state as string, start.toISOString(), end.toISOString())
})
</script>

<style scoped>
.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.block:last-child {
  border-right: none;
}
.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 15px;
}
.box-card1 {
  width: 600px;
  height: 800px;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
