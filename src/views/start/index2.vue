<template>
  <a-steps :active="activeStep" style="max-width: 600px">
    <a-step title="第一阶段" description="配置消息来源" />
    <a-step title="第二阶段" description="配置消息robot" />
    <a-step title="第三阶段" description="配置markdown模板" />
    <a-step title="最终阶段" description="提交配置" />
  </a-steps>

  <el-form :model="formData" ref="formRef" label-width="120px" style="max-width: 600px">
    <!-- 步骤 1 -->
    <div v-if="activeStep === 0">
      <el-form-item label="来源昵称" prop="niname" :rules="[{ required: true, message: '必填项' }]">
        <el-input v-model="formData.niname" />
      </el-form-item>
      <el-form-item
        label="receiver值"
        prop="receiver"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-input v-model.number="formData.receiver" />
      </el-form-item>
    </div>

    <!-- 步骤 2 -->
    <div v-if="activeStep === 1">
      <el-form-item
        label="robot昵称"
        prop="robot_name"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-input v-model="formData.robot_name" />
      </el-form-item>
      <el-form-item
        label="robot类型"
        prop="robot_class"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-input v-model="formData.robot_class" />
      </el-form-item>
      <el-form-item label="密钥" prop="secret" :rules="[{ required: true, message: '必填项' }]">
        <el-input v-model="formData.secret" />
      </el-form-item>
      <el-form-item
        label="token"
        prop="accesstoken"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-input v-model="formData.accesstoken" />
      </el-form-item>
      <el-checkbox v-model="formData.switch">启用机器人</el-checkbox>
    </div>

    <!-- 步骤 3 -->
    <div v-if="activeStep === 2">
      <!-- <el-form-item label="md模板" prop="markdown" :rules="[{ required: true, message: '必填项' }]">
          <el-input v-model="formData.markdown" />
        </el-form-item> -->
      <el-input
        label="md模板"
        type="textarea"
        v-model="formData.markdown"
        placeholder="请输入Markdown内容"
        rows="10"
        :rules="[{ required: true, message: '必填项' }]"
      />
    </div>

    <!-- 步骤 4 -->
    <div v-if="activeStep === 3">
      <p>确认信息:</p>
      <p>来源昵称: {{ formData.niname }}</p>
      <p>receiver值: {{ formData.receiver }}</p>
      <p>robot昵称: {{ formData.robot_name }}</p>
      <p>robot类型: {{ formData.robot_class }}</p>
      <p>密钥: {{ formData.secret }}</p>
      <p>token: {{ formData.accesstoken }}</p>
      <p>md模板: {{ formData.markdown }}</p>
    </div>

    <a-form-item>
      <a-button @click="prevStep" :disabled="activeStep === 0">上一步</a-button>
      <a-button @click="nextStep" :disabled="activeStep === 3">下一步</a-button>
      <a-button type="primary" @click="submitForm" v-if="activeStep === 3">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const activeStep = ref(0)
const formData = reactive({
  niname: '',
  receiver: '',
  robot_name: '',
  robot_class: '',
  secret: '',
  accesstoken: '',
  markdown: '',
  switch: true
})

const nextStep = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (activeStep.value < 3) activeStep.value++
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
