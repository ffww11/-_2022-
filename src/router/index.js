import { createRouter, createWebHistory } from 'vue-router';

// 导入你的页面组件
import HomePage from '@/components/home/home.vue';
import LoginPage from '@/components/login.vue'; // 创建你的课程页面

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;