<template>
  <el-space wrap :size="10">
    <el-col v-for="(item, index) in receivers" :key="index" :span="5">
      <el-card shadow="hover" class="box-card" style="width: 260px">
        <el-space :size="93">
          <div>
            {{ item.niname }}
          </div>
          <el-button type="">
            <el-icon style="vertical-align: middle">
              <Delete />
            </el-icon>
            <span style="vertical-align: middle"> 删除 </span>
          </el-button>
        </el-space>
        <el-divider border-style="dashed" />
        <el-space :size="1" :spacer="spacer">
          <el-badge :value="item.mnumber_firing" :max="99" class="item">
            <el-button type="warning" :icon="Notification">firing</el-button>
          </el-badge>
          <el-badge :value="item.mnumber_resolved" :max="99" class="item">
            <el-button type="primary" :icon="Notification">resolved</el-button>
          </el-badge>
        </el-space>
      </el-card>
    </el-col>
  </el-space>
</template>
<script setup lang="ts">
import { Delete, Notification } from '@element-plus/icons-vue'
import { h, onMounted, reactive } from 'vue'
import { getmarkdownbystatus, getreceivers } from '@/api/login'
import { ElDivider } from 'element-plus'
import { SelectMarkDownByStatus } from '@/api/login/types'
type receiver = {
  niname: string
  receiver_name: string
  mnumber_firing: number
  mnumber_resolved: number
}

const receivers = reactive<receiver[]>([])

const select_recevicer = async () => {
  // debugger
  getreceivers()
    .then((responses) => {
      var i
      for (i = 0; i < responses.data.length; i++) {
        receivers[i] = responses.data[i]
        const n = select_markdownnumbykey(receivers[i].receiver_name, 'firing')
        receivers[i].mnumber_firing = n
        const m = select_markdownnumbykey(receivers[i].receiver_name, 'resolved')
        receivers[i].mnumber_resolved = m
      }
    })
    .catch((error) => {
      console.error('请求发生错误:', error)
    })
}

let mnumber: number
// 查询指定的markdown数量
const select_markdownnumbykey = (i: string, s: string): number => {
  const params: SelectMarkDownByStatus = { index: i, status: s }
  // 使用 await 等待异步操作完成
  getmarkdownbystatus(params).then((res) => {
    // 直接返回从 API 获取到的值
    mnumber = res.data.number
  })
  console.log(mnumber)
  return mnumber
}

const spacer = h(ElDivider, { direction: 'vertical' })

// 使用钩子初始化
onMounted(select_recevicer)
</script>
