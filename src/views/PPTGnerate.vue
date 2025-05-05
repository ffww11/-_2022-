  <template>
    <div class="chat-layout">
      <!-- 左侧固定区域 -->
      <div class="chat-sidebar">
        <div class="history-header">
          <h2>聊天记录</h2>
          <button class="new-chat" @click="startNewChat">
            <PlusIcon class="icon" />
            新对话
          </button>
        </div>
        <div class="history-list">
          <div
              v-for="chat in chatHistory"
              :key="chat.id"
              class="history-item"
              :class="{ 'active': currentChatId === chat.id }"
          >
            <div @click="loadChat(chat.id)" class="history-item-content">
              <ChatBubbleLeftRightIcon class="icon" />
              <span class="title">{{ chat.title || '新对话' }}</span>
            </div>
            <button @click.stop="deleteChat(chat.id)" class="delete-btn">
              <TrashIcon class="icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="chat-main">
        <!-- 上部分：可滚动的对话内容 -->
        <div class="chat-messages" ref="chatHistory">
          <div v-for="(message, index) in messages" :key="index"
               :class="['message-wrapper', message.sender === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper']">
            <div :class="['message-content', message.sender === 'user' ? 'user-message' : 'ai-message']">
              <div v-if="message.sender === 'ai' && index === messages.length - 1 && isStreaming" class="typing-indicator">
                <span>{{ message.text }}</span><span class="cursor"></span>
              </div>
              <div v-else>{{ message.text }}</div>
            </div>
          </div>
          <div v-if="isStreaming && messages.length === 0" class="message-wrapper ai-message-wrapper">
            <div class="message-content ai-message">
              <div class="typing-indicator">
                <span>思考中</span><span class="cursor"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- PPT预览区域 -->
        <div v-if="pptFile" class="ppt-preview-area">
          <h3>PPT预览</h3>
          <iframe
            :src="pptPreviewUrl"
            frameborder="0"
            class="ppt-preview-frame"
            v-if="pptPreviewUrl"></iframe>
          <button
            @click="downloadPPT"
            class="download-btn">
            下载PPT
          </button>
        </div>

        <!-- 下部分：固定的输入框和导航区域 -->
        <div class="chat-input-area">
          <div class="input-container">
            <div class="chat-input">
              <textarea
                  v-model="userInput"
                  placeholder="输入信息..."
                  @keypress.enter.prevent="sendMessage"
                  :disabled="isStreaming"
              ></textarea>
              <button @click="sendMessage" :disabled="isStreaming || !userInput.trim()">
                <span v-if="!isStreaming">发送</span>
                <span v-else>请等待...</span>
              </button>
            </div>
            <div class="nav-select">
              <select v-model="selectedPage" @change="navigateTo" class="nav-dropdown">
                <option value="/">首页</option>
                <option value="/aichat">AI聊天</option>
                <option value="/pptgenerate">PPT生成</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>

  import { PlusIcon, ChatBubbleLeftRightIcon, TrashIcon } from '@heroicons/vue/24/outline';

  export default {
    name: 'PPTGnerate',
    components: {
      PlusIcon,
      ChatBubbleLeftRightIcon,
      TrashIcon
    },
    data() {
      return {
        userInput: '',
        messages: [],
        eventSource: null,
        isStreaming: false,
        chatHistory: [],
        currentChatId: null,
        lastUserMessage: '',
        pptFile: null,
        pptPreviewUrl: null,
        isGeneratingPPT: false,
        selectedPage: '/pptgenerate'
      };
    },
    created() {
      // 从本地存储加载聊天历史
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        this.chatHistory = JSON.parse(savedHistory);
      }

      // 如果有历史记录，加载最新的聊天
      if (this.chatHistory.length > 0) {
        this.loadChat(this.chatHistory[0].id);
      } else {
        // 否则创建新聊天
        this.startNewChat();
      }
    },
    methods: {
      async sendMessage() {
        if (this.userInput.trim() === '' || this.isStreaming) return;

        const content = this.userInput.trim();
        this.lastUserMessage = content;
        this.userInput = '';

        // 添加用户消息
        this.messages.push({ sender: 'user', text: content });

        // 添加初始AI消息（空内容）
        const aiMessage = { sender: 'ai', text: '' };
        this.messages.push(aiMessage);

        // 中止之前的连接
        if (this.eventSource) {
          this.eventSource.close();
        }

        this.isStreaming = true;

        try {
          const url = 'http://localhost:5300/api/ppt';
          console.log('发送PPT生成请求');

          const index = this.messages.length - 1;
          this.messages[index].text = '正在生成PPT...';

          // 准备表单数据
          const formData = new FormData();
          formData.append('content', content);

          // 添加默认选项
          formData.append('template_style', 'professional');
          formData.append('color_theme', 'blue');

          // 使用POST方法发送请求
          const response = await fetch(url, {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '生成PPT失败');
          }

          // 保存PPT文件供预览和下载
          const blob = await response.blob();

          // 验证文件类型
          if (!blob.type.includes('presentation') && !blob.type.includes('octet-stream')) {
            throw new Error('服务器返回的不是有效的PPT文件');
          }

          // 验证文件大小
          if (blob.size < 1024) {
            throw new Error('PPT文件大小异常，可能生成失败');
          }

          this.pptFile = blob;
          this.pptPreviewUrl = window.URL.createObjectURL(blob);

          this.messages[index].text = 'PPT生成完成，请预览后下载';
          console.log('PPT文件信息:', {
            size: blob.size,
            type: blob.type
          });
          this.handleStreamEnd();
        } catch (error) {
          console.error('生成PPT失败:', error);
          const index = this.messages.length - 1;
          this.messages[index].text = `生成PPT失败: ${error.message}`;
          this.handleStreamEnd();
        }
      },

      handleStreamEnd() {
        console.log('结束流式传输');
        // 关闭连接
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;  // 重置为 null
        }

        this.isStreaming = false;

        // 更新聊天标题（如果是第一条消息）
        if (this.messages.length <= 2 && this.lastUserMessage) {
          // 使用用户的第一条消息作为标题
          const title = this.lastUserMessage.length > 20
            ? this.lastUserMessage.substring(0, 20) + '...'
            : this.lastUserMessage;

          // 更新当前聊天的标题
          const chatIndex = this.chatHistory.findIndex(chat => chat.id === this.currentChatId);
          if (chatIndex !== -1) {
            this.chatHistory[chatIndex].title = title;
            this.saveHistory();
          }
        }

        // 保存当前聊天记录
        this.saveCurrentChat();
      },

      startNewChat() {
        // 创建新的聊天ID
        const newChatId = Date.now().toString();

        // 添加到历史记录
        this.chatHistory.unshift({
          id: newChatId,
          title: '新对话',
          messages: []
        });

        // 设置为当前聊天
        this.currentChatId = newChatId;
        this.messages = [];

        // 保存更新后的历史记录
        this.saveHistory();
      },

      loadChat(chatId) {
        // 先保存当前聊天
        this.saveCurrentChat();

        // 查找并加载指定的聊天记录
        const chat = this.chatHistory.find(chat => chat.id === chatId);
        if (chat) {
          this.currentChatId = chatId;
          this.messages = [...chat.messages];
        }
      },

      saveCurrentChat() {
        if (!this.currentChatId) return;

        // 查找当前聊天并更新消息
        const chatIndex = this.chatHistory.findIndex(chat => chat.id === this.currentChatId);
        if (chatIndex !== -1) {
          this.chatHistory[chatIndex].messages = [...this.messages];
          this.saveHistory();
        }
      },

      async downloadPPT() {
        if (!this.pptFile) return;

        try {
          // 验证文件类型
          if (!this.pptFile.type.includes('presentation') &&
              !this.pptFile.type.includes('octet-stream')) {
            throw new Error('无效的PPT文件类型');
          }

          // 验证文件大小
          if (this.pptFile.size < 10240) {
            throw new Error('PPT文件大小异常');
          }

          const downloadUrl = window.URL.createObjectURL(this.pptFile);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'presentation.pptx';
          a.type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

          document.body.appendChild(a);
          a.click();

          // 清理
          setTimeout(() => {
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
          }, 100);

          this.$message.success('PPT下载成功');
        } catch (error) {
          console.error('下载PPT失败:', error);
          this.$message.error(`下载失败: ${error.message}`);
        }
      },

      deleteChat(chatId) {
        if (confirm('确定要删除这个对话吗？')) {
          this.chatHistory = this.chatHistory.filter(chat => chat.id !== chatId);
          if (this.currentChatId === chatId) {
            this.currentChatId = null;
            this.messages = [];
          }
          this.saveHistory();
        }
      },

      navigateTo() {
        if (this.selectedPage) {
          this.$router.push(this.selectedPage);
        }
      },

      saveHistory() {
        // 限制历史记录数量，最多保存20条
        if (this.chatHistory.length > 20) {
          this.chatHistory = this.chatHistory.slice(0, 20);
        }

        // 保存到本地存储
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
      },

      beforeUnmount() {
        // 组件销毁时关闭连接并保存聊天记录
        if (this.eventSource) {
          this.eventSource.close();
        }
        this.saveCurrentChat();
      }
    }
  };
  </script>

  <style>
  /* 基础布局样式 */
  .chat-layout {
    display: flex;
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    background-color: #f5f5f5;
  }

  /* 左侧边栏样式 */
  .chat-sidebar {
    width: 260px;
    background-color: #fff;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0; /* 防止侧边栏被压缩 */
  }

  .history-header {
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0; /* 防止头部被压缩 */
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  /* 右侧主要内容区域 */
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    overflow: hidden; /* 隐藏主容器的滚动条 */
  }

  /* 上部分：消息区域 */
  .chat-messages {
    flex: 1;
    overflow-y: scroll; /* 改为 scroll，确保内容可滚动 */
    padding: 20px;
    background-color: #f8f9fa;
    margin-right: -17px; /* 补偿滚动条的宽度 */
    padding-right: 37px; /* 原来的padding(20px) + 滚动条宽度(17px) */
  }

  /* 下部分：输入和导航区域 */
  .chat-input-area {
    padding: 20px;
    background-color: #fff;
    border-top: 1px solid #e0e0e0;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .input-container {
    display: flex;
    gap: 15px;
  }

  .chat-input {
    flex: 1;
    display: flex;
    gap: 10px;
  }

  .nav-select {
    width: 120px;
  }

  .nav-dropdown {
    width: 100%;
    padding: 12px 15px;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 1em;
  }

  .nav-dropdown:hover {
    background-color: #e0e0e0;
  }

  .nav-dropdown:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.3);
  }

  /* 消息样式 */
  .message-wrapper {
    display: flex;
    margin-bottom: 15px;
    padding: 0 20px;
    width: 100%; /* 确保包裹整个宽度 */
  }

  .ai-message-wrapper {
    justify-content: flex-start;
  }

  .user-message-wrapper {
    justify-content: flex-end;
  }

  .message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 12px;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left; /* 确保文本左对齐 */
  }

  .user-message {
    background-color: #42b983;
    color: white;
    border-top-right-radius: 4px;
  }

  .ai-message {
    background-color: #f1f1f1;
    color: #333;
    border-top-left-radius: 4px;
    align-self: flex-start; /* 确保消息框从左侧开始 */
    margin-right: auto; /* 将消息框推到左侧 */
    text-align: left; /* 文本左对齐 */
  }

  /* 输入框样式 */
  .chat-input {
    display: flex;
    gap: 10px;
  }

  .chat-input textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    resize: none;
    height: 60px;
    font-size: 14px;
    line-height: 1.5;
  }

  .chat-input button {
    padding: 0 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .chat-input button:hover:not(:disabled) {
    background-color: #3aa876;
  }

  .chat-input button:disabled {
    background-color: #a8d5c2;
    cursor: not-allowed;
  }

  /* 历史记录项样式 */
  .history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .history-item-content {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .delete-btn {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
  }

  .delete-btn:hover {
    color: #ff4d4f;
  }

  .history-item:hover {
    background-color: #f5f5f5;
  }

  .history-item.active {
    background-color: #e3f2fd;
  }

  .history-item .icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  /* 新对话按钮样式 */
  .new-chat {
    display: flex;
    align-items: center;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .new-chat .icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }

  /* 移除之前的滚动条美化样式 */
  .chat-messages::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: transparent;
  }

  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }

  /* PPT预览区域样式 */
  .ppt-preview-area {
    padding: 15px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 15px;
  }

  .ppt-preview-area h3 {
    margin-bottom: 10px;
    color: #333;
  }

  .ppt-preview-frame {
    width: 100%;
    height: 400px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    background-color: #f8f8f8;
  }

  .download-btn {
    padding: 8px 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .download-btn:hover {
    background-color: #3aa876;
  }

  /* 打字指示器样式 */
  .typing-indicator {
    display: inline;
    text-align: left;
  }

  .typing-indicator .cursor {
    display: inline-block;
    width: 8px;
    height: 16px;
    background-color: #42b983;
    animation: blink 1s infinite;
    margin-left: 5px;
    vertical-align: middle;
  }

  /* 确保消息容器内的文本正确对齐 */
  .message-content > div {
    text-align: left;
    width: 100%;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  </style>
