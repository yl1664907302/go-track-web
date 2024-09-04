import 'vue/jsx'

// 引入unocss
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

import { createApp } from 'vue'

// ele plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// ant
import  DatePicker  from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// ar
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

import App from './App.vue'

import './permission'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)
  app.use(ElementPlus)
  app.use(DatePicker)
  app.use(ArcoVue)
  app.mount('#app')
}

setupAll()
