import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import HomePage from '@/components/home/home.vue';
import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'
import ArticleManageVue from '@/views/article/ArticleManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'

import HomeView from '../views/HomeView.vue'
import Chat from "@/views/AiChat.vue";
import PPTGnerate from "@/views/PPTGnerate.vue";
import PPTCreate from '@/views/PPTCreate.vue';

//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue,redirect:'/article/manage', children: [
            { path: '/article/category', component: ArticleCategoryVue },
            { path: '/article/manage', component: ArticleManageVue },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue },
            { path: '/user/resetPassword', component: UserResetPasswordVue }
        ]
    },
    {   path: '/Home', component: HomePage},
    {
        path: '/home2',
        name: 'homepage',
        component: HomeView
      },
    {
        path: '/aichat',
        name: 'aichat',
        component: Chat
    },
        {
            path: '/pptgenerate',
            name: 'pptgenerate',
            component: PPTGnerate
        }
    
      ,
     
      
       
        {
            path: '/pptcreate',
            name: 'pptcreate',
            component: PPTCreate
        }
    
        ,

]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由
export default router
