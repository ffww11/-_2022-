<template>
  <div class="home">
    <div class="header">
      <h1>师说教学辅助系统</h1>
      <p class="subtitle">智能教学助手，助力教育创新</p>
    </div>

    <div class="button-container">
      <div class="feature-card" @click="navigateToPage('/aichat')">
        <div class="icon-container">
          <ChatBubbleLeftRightIcon class="icon" />
        </div>
        <div class="content">
          <h3>知识问答</h3>
          <p>智能解答教学相关问题，提供专业指导</p>
        </div>
      </div>

      <div class="feature-card" @click="navigateToPage('/PPTCreate')">
        <div class="icon-container">
          <PresentationChartBarIcon class="icon" />
        </div>
        <div class="content">
          <h3>PPT生成</h3>
          <p>快速生成教学课件，提升备课效率</p>
        </div>
      </div>

      <div class="feature-card" @click="navigateToPage('/aichat')">
        <div class="icon-container">
          <DocumentCheckIcon class="icon" />jio
        </div>
        <div class="content">
          <h3>作业批改</h3>
          <p>智能批改学生作业，提供详细反馈</p>
        </div>
      </div>

      <div class="feature-card" @click="navigateToPage('/jiaoan')">
        <div class="icon-container">
          <AcademicCapIcon class="icon" />
        </div>
        <div class="content">
          <h3>教学资源</h3>
          <p>丰富的教学资料和课程设计参考</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  ChatBubbleLeftRightIcon,
  PresentationChartBarIcon,
  DocumentCheckIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline';

export default {
  name: 'HomePage',
  components: {
    ChatBubbleLeftRightIcon,
    PresentationChartBarIcon,
    DocumentCheckIcon,
    AcademicCapIcon
  },
  methods: {
    navigateToPage(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 50px;
  padding: 20px;
}

h1 {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.subtitle {
  font-size: 1.3rem;
  color: #666;
  font-weight: 400;
}

.button-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid #eaeaea;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-color: #42b983;
}

.icon-container {
  width: 70px;
  height: 70px;
  background: #f0f9ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

.feature-card:hover .icon-container {
  background: #e6f7f0;
  transform: scale(1.1);
}

.icon {
  width: 35px;
  height: 35px;
  color: #42b983;
}

.content h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 12px;
  font-weight: 600;
}

.content p {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .button-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .button-container {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .feature-card {
    padding: 20px;
  }
}
</style>