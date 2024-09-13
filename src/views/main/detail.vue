<template>
  <el-row>
    <el-col>
      <el-space>
        <el-card class="box-card1">
          <template #header>
            <div class="card-header">
              <span>消息记录</span>
              <el-button class="button" type="danger" text>{{ state }}</el-button>
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
          <el-card class="box-card2">
            <div class="demo-collapse">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item
                  v-for="(item, index) in collapseItems"
                  :key="index"
                  :title="'id：'+item.title"
                  :name="item.name"
                >
                  <div  v-html="renderMarkdown(item.content)">
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
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
// 获取路由参数
const route = useRoute()
const niname = route.query.niname
const receiver = route.query.receiver
const state = route.query.state

// 默认时间范围设置为 2024 年 9 月 8 日当天
const startDate = new Date(2024, 8, 8, 0, 0, 0) // 9月8日 00:00:00
const endDate = new Date(2024, 8, 8, 23, 59, 59) // 9月8日 23:59:59
const value2 = ref<[Date, Date]>([startDate, endDate])

// 默认时间设置
const defaultTime2 = [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)]

// el-collapse 的 activeNames
const activeNames = ref(['1'])

// 处理 collapse 的切换事件
const handleChange = (val: string[]) => {
  console.log(val)
}

// markdown转换
marked.setOptions({
  gfm: true,        // 启用 GitHub 风格的 Markdown
  breaks: true      // 将单个换行符视为 <br>
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
      // 假设 resp.data.markdowns 是一个数组，包含多个 markdown 项
      collapseItems.value = resp.data.markdowns.map((item: any) => ({
        name: item.status, // 例如，用 status 作为 name
        title: item.zhiwen, // 用 zhiwen 作为 title
        content: item.markdown // markdown 内容
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
    getmarkdown("l1", "resolved", start.toISOString(), end.toISOString())
  }
})

// 在组件挂载时调用 getmarkdown，加载默认时间范围的数据
onMounted(() => {
  const [start, end] = value2.value
  getmarkdown("l1", "resolved", "2024-09-09T00:00:00.000Z", "2024-09-10T15:59:59.000Z")
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
  height: 750px;
}
.box-card2 {
  width: 560px;
  height: 500px;
}
</style>
