<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

// 检测是否为离线环境（通过检查是否为 file:// 协议）
const isOffline = computed(() => {
  return window.location.protocol === 'file:'
})

// 下载离线版本
const downloadOfflineVersion = async () => {
  try {
    // 在GitHub Pages上，离线版本位于 ./offline/index.html
    const offlineUrl = './offline/index.html'
    
    const response = await fetch(offlineUrl)
    if (!response.ok) {
      throw new Error('下载失败')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'BIP39-SLIP39-Tool-Offline.html'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    ElMessage.success('离线版本下载成功！')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败，请稍后重试')
  }
}

// 打开在线版本
const openOnlineVersion = () => {
  // 在离线模式下，提供在线版本的链接
  const onlineUrl = 'https://luyhdf.github.io/Mnemonic-Toolkit/'
  window.open(onlineUrl, '_blank')
  ElMessage.info('正在打开在线版本...')
}
</script>

<template>
  <div class="app-header">
    <div class="header-left">
      <el-icon class="app-icon" :size="28">
        <Key />
      </el-icon>
      <h1 class="app-title">BIP39/SLIP39 助记词工具</h1>
      <el-tag size="small">v1.0.0</el-tag>
    </div>
    
    <div class="header-right">
      <!-- 离线环境标识 -->
      <el-tag v-if="isOffline" type="success" size="large">
        <el-icon><SuccessFilled /></el-icon>
        当前为离线版本
      </el-tag>
      
      <!-- 在线环境标识 -->
      <template v-else>
        <el-tag type="primary" size="large">
          <el-icon><Connection /></el-icon>
          当前为在线版本
        </el-tag>
        <span class="separator">|</span>
        <span class="hint">推荐下载</span>
      </template>
      
      <!-- 版本切换按钮 -->
      <el-button 
        v-if="isOffline"
        type="primary"
        size="default"
        @click="openOnlineVersion"
      >
        <el-icon><Link /></el-icon>
        访问在线版
      </el-button>
      
      <el-button 
        v-else
        type="warning" 
        size="default"
        @click="downloadOfflineVersion"
      >
        <el-icon><Download /></el-icon>
        离线版本
      </el-button>
      
      <span v-if="!isOffline" class="hint">下载后可在无网络环境下使用，更安全</span>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  margin: 0;
}

.hint {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.separator {
  color: var(--el-text-color-secondary);
  margin: 0 4px;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .header-right {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .header-right .el-button {
    width: 100%;
  }
  
  .hint {
    display: none;
  }
  
  .separator {
    display: none;
  }
}
</style>
