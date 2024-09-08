<template>
  <el-steps :active="activeStep" style="max-width: 600px">
    <el-step title="第一阶段" description="配置消息来源" />
    <el-step title="第二阶段" description="配置消息robot" />
    <el-step title="第三阶段" description="配置markdown模板" />
    <el-step title="核对阶段" description="提交配置" />
    <el-step title="结果" description="提交完成" />
  </el-steps>

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
      <div style="display: flex">
        <span style="margin-left: 90px">类型</span>
        <el-select v-model="formData.robot_class" class="m-2" placeholder="请选择robot类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="margin-left: 50px"
          />
        </el-select>
      </div>
      <!-- <el-form-item
        label="robot类型"
        prop="robot_class"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-input v-model="formData.robot_class" />
      </el-form-item> -->
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
      <span style="margin-left: 55px">是否启用</span>
      <el-switch
        v-model="formData.switch"
        inline-prompt
        active-text="ON"
        inactive-text="OFF"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; margin-left: 10px"
      />
    </div>

    <!-- 步骤 3 -->
    <div v-if="activeStep === 2">
      <el-form-item label="md模板" prop="markdown" :rules="[{ required: true, message: '必填项' }]">
        <el-input
          label="md模板"
          type="textarea"
          v-model="formData.markdown"
          placeholder="请输入Markdown内容"
          rows="10"
          :rules="[{ required: true, message: '必填项' }]"
        />
      </el-form-item>
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
      <p>robot是否立即使用: {{ formData.switch }}</p>
      <p>是否处理robot: {{ formData.robot_ok }}</p>
      <p>是否处理md: {{ formData.markdown_ok }}</p>
    </div>

    <!-- 步骤 5 -->
    <div v-if="activeStep === 4">
      <el-col :sm="12" :lg="6">
        <el-result icon="success" title="Success Tip" sub-title="Please follow the instructions">
          <template #extra>
            <el-button type="primary">Back</el-button>
          </template>
        </el-result>
        <el-result icon="error" title="error Tip" sub-title="Please follow the instructions">
          <template #extra>
            <el-button type="primary">Back</el-button>
          </template>
        </el-result>
      </el-col>
    </div>
    <el-form-item>
      <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
      <el-button @click="nextStep" :disabled="activeStep === 3">下一步</el-button>
      <el-button @click="skipStep1" v-if="activeStep === 1" type="warning">跳过</el-button>
      <el-button @click="skipStep2" v-if="activeStep === 2" type="warning">跳过</el-button>
      <el-button type="primary" @click="submitForm" v-if="activeStep === 3">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { poststepsform } from '@/api/login'
import { h } from 'vue'
import { ElNotification } from 'element-plus'

const formRef = ref<FormInstance>()
const activeStep = ref(0)
const formData = reactive({
  niname: '',
  receiver: '',
  robot_name: '',
  robot_class: '',
  secret: '',
  accesstoken: '',
  markdown: `{{ if eq .Status "firing" }}
## <font color="#FF0000">【报警中】服务器{{ .Labels.instance }}</font>
{{ else if eq .Status "resolved" }}
## <font color="#20B2AA">【已恢复】服务{{ .Labels.instance }}</font>
{{ else }}
## 标题：信息通知
{{ end }}
===================
**告警规则**:{{ .Labels.alertname }}
**告警级别**:{{ .Labels.severity }}
**主机名称**:{{ .Labels.instance }}
**告警详情**:{{ .Annotations.description }}
**告警状态**:{{ .Status }}
**触发时间**:{{ .StartsAt }} {{ if eq .Status "resolved" }}
**恢复时间**:{{ .EndsAt }} {{ end }}
**规则详情**:[Prometheus控制台]({{ .GeneratorURL }})`,
  switch: true,
  robot_ok: true,
  markdown_ok: true
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

const skipStep1 = () => {
  // 跳过当前步骤，直接跳到下一步骤
  if (activeStep.value == 1) {
    activeStep.value++
    formData.switch = false
    formData.robot_ok = false
    formData.robot_name = ''
    formData.robot_class = ''
    formData.secret = ''
    formData.accesstoken = ''
  }
}

const skipStep2 = () => {
  // 跳过当前步骤，直接跳到下一步骤
  if (activeStep.value == 2) {
    activeStep.value++
    formData.markdown_ok = false
    formData.markdown = ''
  }
}

const submitForm = () => {
  debugger
  poststepsform(formData)
    .then((response) => { // 这个地方接受的参数就是undefined
      console.log('完整响应:', response.code)
    })
    .catch((error) => {
      console.error('请求发生错误:', error)
    })
}

const options = [
  {
    value: 'dingtalk',
    label: '钉钉'
  }
]

// const status = ref<number | null>(null)
// const responses = () => {
//   ElNotification({
//     title: 'Title',
//     message: h('i', { style: 'color: teal' }, '创建成功')
//   })
// }
</script>

<style scoped>
.el-steps {
  margin-bottom: 20px;
}
</style>
