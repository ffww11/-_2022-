import './assets/main.css'; // 引入全局样式
import { createApp } from 'vue';
import App from './App.vue';

// 引入路由配置文件（注意路径）
import router from './router/index.js'; // 使用相对路径

// 创建 Vue 应用
const app = createApp(App);

// 注册路由
app.use(router);

// 挂载应用到 DOM
app.mount('#app');