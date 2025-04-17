<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from '../icons/IconDocumentation.vue'
import ToolingIcon from '../icons/IconTooling.vue'
import EcosystemIcon from '../icons/IconEcosystem.vue'
import CommunityIcon from '../icons/IconCommunity.vue'
import SupportIcon from '../icons/IconSupport.vue'


</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>在线错题本</template>

    在线错题本功能可以帮助学生高效记录和管理错误题目，支持分类整理、重点标记和复习提醒。通过数据分析，帮助学生找到薄弱知识点。
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>智能教案</template>

    智能教案功能为教师提供强大的备课工具，支持自动生成教学计划、资源推荐和课堂互动设计。同时支持个性化调整，满足不同教学需求。
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>AI学习助手</template>

    AI学习助手利用人工智能技术，为学生提供个性化的学习建议和实时答疑服务。无论是知识点解析还是学习路径规划，都能助你事半功倍。
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>讨论区</template>

    讨论区是师生交流的重要平台，学生可以在这里提问、分享学习心得，教师也可以参与讨论，解答疑惑。让我们一起构建一个充满活力的学习社区！
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>语言风格的选择</template>

    我们支持多种语言风格的教学内容，无论是严谨学术风还是轻松活泼风，都可以根据学生的需求进行选择和切换，打造最适合的学习体验。
  </WelcomeItem>
</template>