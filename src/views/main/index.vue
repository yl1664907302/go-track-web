<template>
   <el-row :gutter="12" class="demo-radius">
  <el-space wrap :size="10">
    <el-col v-for="(item, index) in receivers" :key="index" :span="5">
      <el-card  shadow="hover" class="flex flex-col justify-center items-center custom-card"       m="auto"
      w="46" style="width: 260px">
        <el-space :size="120">
            <el-text class="mx-1" tag="b" >
               {{ item.niname }}
            </el-text>
            <el-popconfirm title="你确定要删除此模块吗?">
              <template #reference>
          <el-button type="">
            <el-icon style="vertical-align: middle">
              <Delete />
            </el-icon>
          </el-button>
        </template>
        </el-popconfirm>
        </el-space>
        <el-divider border-style="dashed" />
        <el-space :size="1" :spacer="spacer">
          <el-badge :value="item.mnumber_firing" :max="99" class="item">
            <el-button type="danger" :icon="Notification">firing</el-button>
          </el-badge>
          <el-badge :value="item.mnumber_resolved" :max="99" class="item">
            <el-button type="success" :icon="Notification">resolved</el-button>
          </el-badge>
        </el-space>
      </el-card>
    </el-col>
  </el-space>
</el-row>
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
  getreceivers()
  .then((responses) => {
    responses.data.forEach((receiver, i) => {
      receivers[i] = receiver;

      // 创建局部引用保存异步的接收者对象
      const currentReceiver = receivers[i];

      // 异步的获取接收者正在告警数
      select_markdownnumbykey(currentReceiver.receiver_name, 'firing')
        .then((res) => {
          currentReceiver.mnumber_firing = res;
        })
        .catch((error) => console.error('Error fetching firing markdown number:', error));

      // 异步的获取接收者恢复告警数
      select_markdownnumbykey(currentReceiver.receiver_name, 'resolved')
        .then((res) => {
          currentReceiver.mnumber_resolved = res;
        })
        .catch((error) => console.error('Error fetching resolved markdown number:', error));
    });
  })
  .catch((error) => {
    console.error('请求发生错误:', error);
  });
}

let mnumber: number;
// 查询指定的markdown数量
const select_markdownnumbykey = async (i: string, s: string): Promise<number> => {
  const params: SelectMarkDownByStatus = { index: i, status: s };

  // 等待异步操作完成
  try {
    const res = await getmarkdownbystatus(params);
    mnumber = res.data.number;
    console.log(mnumber);
    return mnumber;
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return 0; // or handle the error appropriately
  }
};


const spacer = h(ElDivider, { direction: 'vertical' })

// 使用钩子初始化
onMounted(select_recevicer)
</script>

<style scoped>
.custom-card {
  background-color: #FAFAFA;
  color: #333;
  border: 1px solid #ccc;
}
</style>