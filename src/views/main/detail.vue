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
                  :title="item.title"
                  :name="item.name"
                >
                  <div v-for="(content, cIndex) in item.content" :key="cIndex">
                    {{ content }}
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
import { ref, watch } from 'vue'
import { Dayjs } from 'dayjs'
import { getmarkdownbystatus2time } from '@/api/login'
import { SelectMarkDownByStatus2Time } from '@/api/login/types'
const activeKey = ref(['1'])
const route = useRoute()
const niname = route.query.niname
const receiver = route.query.receiver
const state = route.query.state
const value2 = ref('')
const defaultTime2 = [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)]
const activeNames = ref(['1'])
const handleChange = (val: string[]) => {
  console.log(val)
}

// 数据源，包含每个 el-collapse-item 的 title 和内容
const collapseItems = ref([
  {
    name: '1',
    title: 'Consistency',
    content: '11'
  }
])

const getmarkdown = () => {
  const params: SelectMarkDownByStatus2Time = {
    index: '',
    status: '',
    time_start: '',
    time_end: ''
  }

  getmarkdownbystatus2time(params).then((resp) => {
    for (let i = 0; i < resp.data.markdowns.length; i++) {
      collapseItems.value[i].name = resp.data.markdowns[i].status
      collapseItems.value[i].title = resp.data.markdowns[i].zhiwen
      collapseItems.value[i].content = resp.data.markdowns[i].markdown
    }
  })
}

watch(value2, (newValue, oldValue) => {})
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
