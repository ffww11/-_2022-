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
            <!-- 用户消息 -->
            <div v-if="message.sender === 'user'">{{ message.text }}</div>

            <!-- AI消息 - 流式传输中 -->
            <div v-else-if="message.sender === 'ai' && index === messages.length - 1 && isStreaming"
                 class="typing-indicator markdown-content"
                 :ref="`aiMsg_${index}`"
                 v-html="marked.parse(message.text)">
            </div>

            <!-- AI消息 - 已完成 -->
            <div v-else class="markdown-content" v-html="marked.parse(message.text)"></div>
          </div>
        </div>

        <!-- 初始加载指示器 -->
        <div v-if="isStreaming && messages.length === 0" class="message-wrapper ai-message-wrapper">
          <div class="message-content ai-message">
            <div class="typing-indicator">
              <span>思考中</span><span class="cursor"></span>
            </div>
          </div>
        </div>
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
import { marked } from 'marked';

export default {
  name: 'AiChat',
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
      selectedPage: '/aichat',
      marked: marked // 将marked实例添加到data中以便在模板中使用
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
    sendMessage() {
      if (this.userInput.trim() === '' || this.isStreaming) return;

      const content = this.userInput.trim();
      this.lastUserMessage = content;
      this.userInput = '';

      // 添加用户消息
      this.messages.push({
        sender: 'user',
        text: content.replace(/\n{3,}/g, '\n\n')
      });

      // 初始化AI消息
      const aiMessage = {
        sender: 'ai',
        text: ''
      };
      this.messages.push(aiMessage);

      // 中止之前的连接
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.isStreaming = true;
      const messageIndex = this.messages.length - 1;

      try {
        const url = `http://localhost:5300/api/chat?content=${encodeURIComponent(content)}`;
        console.debug('建立SSE连接:', url);

        this.eventSource = new EventSource(url);

        this.eventSource.onopen = (event) => {
          console.debug('EventSource连接已打开:', event);
        };

        this.eventSource.onmessage = (event) => {
          try {
            if (event.data === '[END]') {
              this.finalizeMessage(messageIndex);
              return;
            }

            // 尝试解析JSON格式的数据
            let content = '';
            try {
              const jsonData = JSON.parse(event.data);
              if (jsonData.type === 'end') {
                this.finalizeMessage(messageIndex);
                return;
              }
              content = jsonData.content || jsonData.message || event.data;
            } catch (e) {
              content = event.data;
            }

            // 更新最后一条消息的内容
            const lastMessage = this.messages[messageIndex];
            lastMessage.text += content;
            
            // 触发响应式更新
            this.$forceUpdate();
            
            // 滚动到底部
            this.$nextTick(() => {
              const container = this.$refs.chatHistory;
              if (container) {
                container.scrollTop = container.scrollHeight;
              }
            });
          } catch (error) {
            console.error('处理消息失败:', error);
          }
        };

        this.eventSource.onerror = (error) => {
          console.error('[SSE Error]', error);
          this.finalizeMessage(messageIndex, true);
        };

      } catch (error) {
        console.error('[连接错误]', error);
        this.handleStreamError(messageIndex, '建立连接失败');
      }
    },

    finalizeMessage(index, isError = false) {
      const msg = this.messages[index];
      this.isStreaming = false;

      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }

      // 错误状态处理
      if (isError && (!msg.text || msg.text.trim() === '')) {
        msg.text = '响应中断，部分内容可能不完整';
      }

      // 更新聊天标题（如果是第一条消息）
      if (this.messages.length <= 2 && this.lastUserMessage) {
        const title = this.lastUserMessage.length > 20
          ? this.lastUserMessage.substring(0, 20) + '...'
          : this.lastUserMessage;

        const chatIndex = this.chatHistory.findIndex(chat => chat.id === this.currentChatId);
        if (chatIndex !== -1) {
          this.chatHistory[chatIndex].title = title;
          this.saveHistory();
        }
      }

      // 保存当前聊天记录
      this.saveCurrentChat();
    },

    handleStreamError(index, errorMsg) {
      this.isStreaming = false;
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }

      const msg = this.messages[index];
      msg.text = msg.text
        ? `${msg.text}\n\n（${errorMsg}）`
        : errorMsg;
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

<style scoped>
.chat-layout {
  display: flex;
  height: 100vh;
  background-color: #ffffff;
}

.chat-sidebar {
  width: 20%;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #ffffff;
}

.history-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #262626;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.new-chat-container {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background-color: #ffffff;
}

.new-chat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
}

.new-chat:hover {
  background-color: #3aa876;
}

.new-chat .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: #f1f3f5;
}

.history-item.active {
  background-color: #e8f5e9;
}

.history-item-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
}

.history-item-content .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #666;
  flex-shrink: 0;
}

.history-item-content .title {
  font-size: 0.875rem;
  color: #262626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  padding: 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  color: #666;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: #f44336;
}

.delete-btn .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.chat-main {
  width: 80%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  position: relative;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  background-color: #ffffff;
  width: 100%;
}

.messages {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
}

.message-wrapper {
  display: flex;
  padding: 1.5rem 0;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.user-message-wrapper {
  justify-content: flex-end;
}

.message-content {
  min-width: 0;
  padding: 1rem;
  border-radius: 0.75rem;
  line-height: 1.6;
  font-size: 1rem;
  animation: message-pop 0.3s ease;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 80%;
}

.user-message {
  background-color: #42b983;
  color: white;
  border-radius: 0.75rem 0.75rem 0.25rem 0.75rem;
  max-width: fit-content/1.5;
  margin-right: 10px;
}

.ai-message {
  background-color: #FFFFFF;
  color: #262626;
  border-radius: 0.75rem 0.75rem 0.75rem 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-left: 30px;
}

.chat-input-area {
  padding: 1.25rem;
  background-color: #ffffff;
  border-top: 1px solid #e9ecef;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.input-container {
  max-width: 1000px;
  margin: 0 auto;
}

.chat-input {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
}

.chat-input textarea {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.5;
  min-height: 2.5rem;
  max-height: 10rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #f8f9fa;
}

.chat-input textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

.chat-input button {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
  align-self: flex-end;
}

.chat-input button:hover:not(:disabled) {
  background-color: #3aa876;
}

.chat-input button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.nav-select {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  height: 30px;
}

.nav-dropdown {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: #f8f9fa;
  cursor: pointer;
  color: #262626;
  transition: border-color 0.2s;
}

.nav-dropdown:focus {
  outline: none;
  border-color: #42b983;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>