<script setup>
defineProps({
  platformName: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="home-page">
    <h1 class="green">{{ platformName }}</h1>
    <h3>
      欢迎来到我们的在线学习平台！在这里，你可以：
    </h3>
    <ul class="features">
      <li>探索丰富的课程资源</li>
      <li>个性化学习指导</li>
      <li>便利学习教学工具</li>
    </ul>
    <p class="cta">
      <a href="/courses" class="button">开始学习</a>
    </p>
  </div>
</template>

<style scoped>
.home-page {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-weight: 600;
  font-size: 2.8rem;
  margin-bottom: 1rem;
  color: #42b983; /* 绿色主题 */
}

h3 {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.features {
  list-style-type: none;
  padding: 0;
  margin-bottom: 2rem;
}

.features li {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #555;
}

.cta .button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.cta .button:hover {
  background-color: #3aa876;
}

@media (min-width: 1024px) {
  .home-page {
    text-align: left;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    font-size: 3.2rem;
  }

  h3 {
    font-size: 1.6rem;
  }

  .features li {
    font-size: 1.3rem;
  }
}
</style>