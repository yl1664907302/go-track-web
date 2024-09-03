<template>
  <el-steps :active="activeStep" style="max-width: 600px">
    <el-step title="第一阶段" description="配置消息来源" />
    <el-step title="第二阶段" description="配置消息robot" />
    <el-step title="第三阶段" description="配置markdown模板" />
  </el-steps>

  <el-form :model="formData" ref="formRef" label-width="120px" style="max-width: 600px">
    <!-- 步骤 1 -->
    <div v-if="activeStep === 0">
      <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '姓名是必填项' }]">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item
        label="年龄"
        prop="age"
        :rules="[
          { required: true, message: '年龄是必填项' },
          { type: 'number', message: '年龄必须是数字' }
        ]"
      >
        <el-input v-model.number="formData.age" />
      </el-form-item>
    </div>

    <!-- 步骤 2 -->
    <div v-if="activeStep === 1">
      <el-form-item
        label="邮箱"
        prop="email"
        :rules="[
          { required: true, message: '邮箱是必填项' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]"
      >
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formData.address" />
      </el-form-item>
    </div>

    <!-- 步骤 3 -->
    <div v-if="activeStep === 2">
      <p>确认信息:</p>
      <p>姓名: {{ formData.name }}</p>
      <p>年龄: {{ formData.age }}</p>
      <p>邮箱: {{ formData.email }}</p>
      <p>地址: {{ formData.address }}</p>
    </div>

    <el-form-item>
      <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
      <el-button @click="nextStep" :disabled="activeStep === 2">下一步</el-button>
      <el-button type="primary" @click="submitForm" v-if="activeStep === 2">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const activeStep = ref(0)
const formData = reactive({
  name: '',
  age: '',
  email: '',
  address: ''
})

const nextStep = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (activeStep.value < 2) activeStep.value++
    } else {
      console.log('表单验证失败')
    }
  })
}

const prevStep = () => {
  if (activeStep.value > 0) activeStep.value--
}

const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log('提交的数据:', formData)
    } else {
      console.log('表单验证失败')
    }
  })
}
</script>

<style scoped>
.el-steps {
  margin-bottom: 20px;
}
</style>
