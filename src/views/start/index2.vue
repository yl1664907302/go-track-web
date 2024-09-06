<template>
  <el-col :sm="12" :lg="6">
    <el-result
      v-if="status.result === 'success'"
      icon="success"
      title="Success Tip"
      sub-title="Please follow the instructions"
    >
      <template #extra>
        <el-button type="primary">Back</el-button>
      </template>
    </el-result>
    <el-result
      v-if="status.result === 'error'"
      icon="error"
      title="error Tip"
      sub-title="Please follow the instructions"
    >
      <template #extra>
        <el-button type="primary">Back</el-button>
      </template>
    </el-result>
  </el-col>
</template>

<script lang="ts">
import { reactive } from 'vue'

const status = reactive({
  result: ''
})
</script>
