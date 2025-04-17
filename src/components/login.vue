<template>
    <div class="login-page min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <!-- 平台标题 -->
        <h1 class="text-3xl font-bold text-center text-green-600 mb-6">在线教育平台</h1>
  
        <!-- 错误提示 -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>
  
        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin">
          <!-- 用户名/邮箱输入框 -->
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">用户名/邮箱</label>
            <input
              type="text"
              id="username"
              v-model="credentials.username"
              placeholder="请输入用户名或邮箱"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
  
          <!-- 密码输入框 -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <input
              type="password"
              id="password"
              v-model="credentials.password"
              placeholder="请输入密码"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
  
          <!-- 登录按钮 -->
          <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            登录
          </button>
        </form>
  
        <!-- 其他操作链接 -->
        <div class="mt-4 text-center">
          <a href="#" class="text-sm text-green-600 hover:text-green-800">忘记密码？</a>
          <p class="mt-2 text-sm text-gray-600">
            还没有账号？
            <a href="/register" class="text-green-600 hover:text-green-800">立即注册</a>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 表单数据
  const credentials = ref({
    username: '',
    password: '',
  });
  
  // 错误信息
  const errorMessage = ref('');
  
  // 模拟登录逻辑
  const handleLogin = () => {
    // 简单验证
    if (!credentials.value.username || !credentials.value.password) {
      errorMessage.value = '用户名和密码不能为空！';
      return;
    }
  
    // 模拟 API 请求
    setTimeout(() => {
      if (credentials.value.username === 'admin' && credentials.value.password === '123456') {
        errorMessage.value = '';
        alert('登录成功！');
        // 跳转到主页（根据实际情况调整）
        window.location.href = '/home';
      } else {
        errorMessage.value = '用户名或密码错误，请重试！';
      }
    }, 500);
  };
  </script>
  
  <style scoped>
  .login-page {
    background: linear-gradient(to bottom, #f0f8ff, #e0f7fa);
  }
  </style>