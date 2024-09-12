<template>
  <el-row>
    <el-col>
      <el-space>
        <div :style="{ width: '50%', border: '2px solid #d9d9d9', borderRadius: '15px' }">
    <a-calendar v-model:value="value" :fullscreen="false" @panelChange="onPanelChange" />
  </div>
</el-space>
  </el-col>
  </el-row>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { Dayjs } from 'dayjs';

const route = useRoute()
const niname = route.query.niname
const receiver = route.query.receiver
const state = route.query.state
const value = ref<Dayjs>();
const onPanelChange = (value: Dayjs, mode: string) => {
  console.log(value, mode);
};
</script>
