<template>
  <div :class="['message-wrapper', message.role === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper']">
    <div class="message-avatar">
      <div v-if="message.role === 'user'" class="user-avatar">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
        </svg>
      </div>
      <div v-else class="ai-avatar">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
        </svg>
      </div>
    </div>
    <div :class="['message-content', message.role === 'user' ? 'user-message' : 'ai-message']">
      <div v-if="message.role === 'user'" class="text-content">{{ message.content }}</div>
      <div v-else class="markdown-content" v-html="renderedContent"></div>
      <div v-if="isStream && isLastMessage" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  xhtml: true
});

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    },
    isStream: {
      type: Boolean,
      default: false
    },
    isLastMessage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    renderedContent() {
      if (!this.message.content) return '';
      return DOMPurify.sanitize(marked.parse(this.message.content));
    }
  }
};
</script>

<style scoped>
.message-wrapper {
  display: flex;
  padding: 1.5rem 1rem;
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.message-avatar {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  background-color: #42b983;
  color: white;
}

.ai-avatar {
  background-color: #f1f1f1;
  color: #666;
}

.message-avatar svg {
  width: 1.5rem;
  height: 1.5rem;
}

.message-content {
  flex: 1;
  min-width: 0;
  padding: 1rem;
  border-radius: 0.75rem;
  line-height: 1.6;
  font-size: 1rem;
  animation: message-pop 0.3s ease;
}

.user-message {
  background-color: #42b983;
  color: white;
  border-radius: 0.75rem 0.75rem 0.25rem 0.75rem;
}

.ai-message {
  background-color: #f8f9fa;
  color: #262626;
  border-radius: 0.75rem 0.75rem 0.75rem 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.markdown-content {
  font-size: 1rem;
  line-height: 1.3;
}

.markdown-content :deep(p) {
  margin: 0;
  padding: 0;
}

.markdown-content :deep(pre) {
  background-color: #f0f2f5;
  border-radius: 0.15rem;
  padding: 0.15rem;
  margin: 0;
  overflow-x: auto;
  border: 1px solid #e1e4e8;
}

.markdown-content :deep(code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  background-color: #f0f2f5;
  padding: 0.05em 0.2em;
  border-radius: 0.15rem;
  border: 1px solid #e1e4e8;
}

.markdown-content :deep(blockquote) {
  border-left: 2px solid #42b983;
  margin: 0;
  padding-left: 0.5rem;
  color: #666;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0;
  padding-left: 1rem;
}

.markdown-content :deep(li) {
  margin: 0;
  padding: 0;
}

.markdown-content :deep(li > ul),
.markdown-content :deep(li > ol) {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-content :deep(li + li) {
  margin-top: 0;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #e0e0e0;
  padding: 0.1rem;
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: #f5f5f5;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 0;
  padding: 0;
  font-weight: 600;
  line-height: 1.2;
}

.markdown-content :deep(h1) {
  font-size: 1.1em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.05em;
}

.markdown-content :deep(h2) {
  font-size: 1.05em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.05em;
}

.markdown-content :deep(h3) {
  font-size: 1.02em;
}

.markdown-content :deep(h4) {
  font-size: 1em;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.typing-indicator span {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #42b983;
  border-radius: 50%;
  display: inline-block;
  animation: blink 1s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes message-pop {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style> 