import { createRouter, createWebHistory } from 'vue-router';

// 导入你的页面组件
import HomePage from '@/components/homelogo.vue';
import CoursesPage from '@/components/homeMed.vue'; // 创建你的课程页面

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/courses',
    name: 'Courses',
    component: CoursesPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;