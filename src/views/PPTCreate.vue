<template>
  <div class="ppt-create-container">
    <div class="form-container">
      <div class="form-header">
        <div class="form-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
          </svg>
        </div>
        <div class="form-title">创建教学/展示PPT</div>
      </div>


      <div class="form-group">
        <label for="title">PPT标题 <span class="required">*</span></label>
        <input
          id="title"
          type="text"
          v-model="pptOptions.title"
          placeholder="请输入PPT标题"
        />
      </div>

      <div class="form-group">
        <label for="content">PPT内容描述 <span class="required">*</span></label>
        <textarea
          id="content"
          v-model="inputContent"
          placeholder="请详细描述您需要的PPT内容，包括主题、要点和特殊要求..."
          rows="5"
        ></textarea>
        <div class="input-tip">详细的描述将帮助AI生成更符合您需求的PPT，内容越详细，生成的PPT质量越高</div>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label for="slide_count">幻灯片数量</label>
          <input
            id="slide_count"
            type="number"
            v-model="pptOptions.slide_count"
            min="10"
            max="30"
            placeholder="建议15-20张"
          />
        </div>

        <div class="form-group half">
          <label for="font_family">字体选择</label>
          <select id="font_family" v-model="pptOptions.font_family">
            <option value="微软雅黑">微软雅黑</option>
            <option value="宋体">宋体</option>
            <option value="黑体">黑体</option>
            <option value="楷体">楷体</option>
            <option value="Arial">Arial</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label for="template_style">模板风格</label>
          <select id="template_style" v-model="pptOptions.template_style">
            <option value="professional">专业商务</option>
            <option value="creative">创意设计</option>
            <option value="minimal">简约风格</option>
            <option value="academic">学术报告</option>
            <option value="modern">现代科技</option>
            <option value="elegant">优雅经典</option>
          </select>
        </div>

        <div class="form-group half">
          <label for="color_theme">颜色主题</label>
          <select id="color_theme" v-model="pptOptions.color_theme">
            <option value="blue">蓝色</option>
            <option value="green">绿色</option>
            <option value="red">红色</option>
            <option value="purple">紫色</option>
            <option value="orange">橙色</option>
            <option value="teal">青色</option>
            <option value="gray">灰色</option>
          </select>
        </div>
      </div>


      <div class="form-divider"></div>

      <div class="form-actions">
        <div class="generation-info">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="info-text">
            生成过程可能需要较长时间，请耐心等待，不要关闭页面
          </div>
        </div>

        <button
          @click="generatePPT"
          :disabled="isLoading"
          class="generate-btn"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '正在生成PPT...' : '生成PPT' }}
        </button>
      </div>

      <div v-if="errorMessage" class="error-message">
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="error-text">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PPTCreate',
  data() {
    return {
      inputContent: '',
      isLoading: false,
      errorMessage: '',
      pptOptions: {
        title: '',
        slide_count: 15,
        template_style: 'professional',
        color_theme: 'blue',
        font_family: '微软雅黑',
      }
    }
  },
  methods: {
    async generatePPT() {
      if (this.inputContent.trim() === '') {
        this.errorMessage = '请输入PPT内容描述';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        // 准备表单数据
        const formData = new FormData();
        formData.append('content', this.inputContent.trim());
        formData.append('title', this.pptOptions.title || '');
        formData.append('slide_count', this.pptOptions.slide_count || '15');
        formData.append('template_style', this.pptOptions.template_style || 'professional');
        formData.append('color_theme', this.pptOptions.color_theme || 'blue');
        formData.append('font_family', this.pptOptions.font_family || '微软雅黑');

        const response = await fetch('http://localhost:5300/api/ppt', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;

          // 使用标题作为文件名（如果有）
          const filename = this.pptOptions.title
            ? `${this.pptOptions.title.replace(/[\\/*?:"<>|]/g, '_')}.pptx`
            : 'presentation.pptx';

          a.download = filename;
          a.click();

          // 清理
          window.URL.revokeObjectURL(url);

          // 显示成功消息
          this.$nextTick(() => {
            setTimeout(() => {
              alert('PPT生成成功！');
            }, 500);
          });
        } else {
          const error = await response.json();
          this.errorMessage = '生成失败: ' + (error.error || '未知错误');
          console.error('生成PPT失败:', error);
        }
      } catch (error) {
        console.error('生成PPT出错:', error);
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          this.errorMessage = '无法连接到服务器，请检查网络连接或确保后端服务正在运行';
        } else if (error.name === 'AbortError') {
          this.errorMessage = '请求超时，请稍后重试';
        } else {
          this.errorMessage = '生成PPT时出错，请稍后重试';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.ppt-create-container {
  display: flex;
  height: 90vh;
  background-color: #ffffff;

  flex-direction: column;
  align-items: center;

}

.form-container {
  max-width: 600px;
  width: 95%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaedf2;
}

.form-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #4285f4;
  border-radius: 10px;
  margin-right: 15px;
  color: white;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}



.required {
  color: #e53935;
  margin-left: 2px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.half {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

textarea, input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.3s, box-shadow 0.3s;
}

textarea:focus, input:focus, select:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

textarea {
  min-height: 120px;
  resize: vertical;
}

select {
  height: 45px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 12px) center;
  padding-right: 30px;
}

.input-tip {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
}

.form-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
}

.option-item {
  display: flex;
  align-items: center;
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.option-item label {
  margin-bottom: 0;
  font-weight: normal;
}

.form-divider {
  height: 1px;
  background-color: #eaedf2;
  margin: 25px 0;
}

.form-actions {
  margin-top: 20px;
  text-align: center;
}

.generation-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: #5f6368;
  font-size: 14px;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #4285f4;
}

.generate-btn {
  padding: 14px 30px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  box-shadow: 0 2px 5px rgba(66, 133, 244, 0.2);
}

.generate-btn:hover {
  background-color: #3367d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
}

.generate-btn:disabled {
  background-color: #a4c2f4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 12px 15px;
  color: #e53935;
  background-color: rgba(229, 57, 53, 0.1);
  border-radius: 8px;
  font-size: 14px;
  border-left: 3px solid #e53935;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #e53935;
}

.error-text {
  flex: 1;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
}
</style>