<template>
  <el-row :gutter="0" class="demo-radius">
    <el-space wrap :size="10">
      <el-col v-for="(item, index) in receivers" :key="index" :span="5">
        <el-card shadow="always" class="dashed" m="auto" w="66" style="width: 260px">
          <el-space :size="120">
            <el-text class="mx-1" tag="b">
              {{ item.niname }}
            </el-text>

            <el-button @click="centerDialogVisible = true" type="">
              <el-icon style="vertical-align: middle">
                <Delete />
              </el-icon>
            </el-button>
          </el-space>
          <el-divider border-style="dashed" />
          <el-space :size="1" :spacer="spacer">
            <el-badge :value="item.mnumber_firing" :max="99" class="item">
              <el-button
                @click="gotodetail(item.niname, item.receiver_name, 'firing')"
                type="danger"
                :icon="Notification"
                >正在告警</el-button
              >
            </el-badge>
            <!-- <el-badge :value="item.mnumber_resolved" :max="99" class="item">
              <el-button type="success" :icon="Notification">resolved</el-button>
            </el-badge> -->
          </el-space>
          <el-dialog v-model="centerDialogVisible" title="警告" width="30%" center>
            <span>你确定要删除此模块吗</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取消</el-button>
                <el-button
                  type="primary"
                  @click="DelReceiver_f(item.receiver_name), (centerDialogVisible = false)"
                  >确定</el-button
                >
              </span>
            </template>
          </el-dialog>
        </el-card>
      </el-col>
    </el-space>
  </el-row>
  <!-- 额外组件 -->
</template>
<script setup lang="ts">
import { Delete, Notification } from '@element-plus/icons-vue'
import { h, onMounted, reactive, ref } from 'vue'
import { getmarkdownbystatus, getreceivers, DelRecevierbyIndex } from '@/api/login'
import { ElDivider, ElNotification } from 'element-plus'
import { SelectMarkDownByStatus, DelRecevier, DelRecevier_response } from '@/api/login/types'
import { useRouter } from 'vue-router'
const centerDialogVisible = ref(false)

type receiver = {
  niname: string
  receiver_name: string
  mnumber_firing: number
  mnumber_resolved: number
}

const receivers = reactive<receiver[]>([])

const select_recevicer = async () => {
  getreceivers()
    .then((responses) => {
      responses.data.forEach((receiver, i) => {
        receivers[i] = receiver

        // 创建局部引用保存异步的接收者对象
        const currentReceiver = receivers[i]

        // 异步的获取接收者正在告警数
        select_markdownnumbykey(currentReceiver.receiver_name, 'active')
          .then((res) => {
            currentReceiver.mnumber_firing = res
          })
          .catch((error) => console.error('Error fetching firing markdown number:', error))

        // // 异步的获取接收者恢复告警数
        // select_markdownnumbykey(currentReceiver.receiver_name, 'resolved')
        //   .then((res) => {
        //     currentReceiver.mnumber_resolved = res
        //   })
        //   .catch((error) => console.error('Error fetching resolved markdown number:', error))
      })
    })
    .catch((error) => {
      console.error('请求发生错误:', error)
    })
}

let mnumber: number
// 查询指定的markdown数量
const select_markdownnumbykey = async (i: string, s: string): Promise<number> => {
  const params: SelectMarkDownByStatus = { index: i, status: s }

  // 等待异步操作完成
  try {
    const res = await getmarkdownbystatus(params)
    mnumber = res.data.number
    console.log(mnumber)
    return mnumber
  } catch (error) {
    console.error('Error fetching markdown:', error)
    return 0 // or handle the error appropriately
  }
}

//执行删除并获取，结果
const delreceiver: DelRecevier_response = { status: '', message: '' }
const DelReceiver_f = (index: string) => {
  // debugger
  const d: DelRecevier = { index: index }
  DelRecevierbyIndex(d)
    .then((resp) => {
      delreceiver.status = resp.data.status
      delreceiver.message = resp.data.message
      // select_recevicer()
      reloadPage()
    })
    .finally(() => {
      ElNoti(delreceiver.status, delreceiver.message)
    })
}

// 通知效果
const ElNoti = (title: string, message: string) => {
  let type_1: string
  if (title == 'success') {
    type_1 = 'success'
  } else {
    type_1 = 'error'
  }
  ElNotification({
    title: title,
    message: h('i', { style: 'color: teal' }, message),
    position: 'top-right',
    type: type_1
  })
}

const spacer = h(ElDivider, { direction: 'vertical' })

// 使用钩子初始化
onMounted(select_recevicer)

//重定向
const router = useRouter()

const reloadPage = () => {
  // 通过当前路径刷新页面
  router.replace({ path: '/alertmanger/show', query: { refresh: new Date().getTime() } })
}

//按钮跳转到详情页面
const gotodetail = (n: string, r: string, s: string) => {
  router.push({
    path: '/alertmanger/status',
    query: {
      niname: n,
      receiver: r,
      state: s
    }
  })
}
</script>

<style scoped>
.custom-card {
  background-color: #fafafa;
  color: #333;
  border: 1px solid #ccc;
}
</style>
