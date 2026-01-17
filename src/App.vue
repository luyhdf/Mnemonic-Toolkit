<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import BIP39 from './components/BIP39.vue'
import SLIP39 from './components/slip39/SLIP39.vue'

const activeTool = ref('bip39')
const bip39Mnemonic = ref('') // 存储BIP39助记词，用于传递给SLIP39组件

// 检测是否为离线环境（通过检查是否为 file:// 协议）
const isOffline = computed(() => {
  return window.location.protocol === 'file:'
})

// 检测是否为在线环境
const isOnline = computed(() => {
  return !isOffline.value
})

const handleBip39ToSlip39 = (mnemonic: string) => {
  console.log('handleBip39ToSlip39 called with mnemonic:', mnemonic)
  bip39Mnemonic.value = mnemonic
  activeTool.value = 'slip39'
  console.log('activeTool changed to:', activeTool.value)
  console.log('bip39Mnemonic set to:', bip39Mnemonic.value)
}

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
</script>

<template>
  <el-config-provider namespace="ep">
    <div class="app-container">
      <el-card class="version-card" shadow="hover">
        <div class="version-content">
          <span>BIP39/SLIP39 助记词工具</span>
          
          <!-- 离线环境标识 -->
          <el-tag v-if="isOffline" type="success" effect="dark">
            <el-icon><SuccessFilled /></el-icon>
            离线版本
          </el-tag>
          
          <!-- 在线环境标识和下载按钮 -->
          <template v-else>
            <el-tag type="primary" effect="dark">
              <el-icon><Connection /></el-icon>
              在线版本
            </el-tag>
            <span class="separator">|</span>
            <span>推荐下载</span>
            <el-button 
              type="warning" 
              size="small"
              @click="downloadOfflineVersion"
            >
              <el-icon><Download /></el-icon>
              离线版本
            </el-button>
            <span class="hint">下载后可在无网络环境下使用，更安全</span>
          </template>
        </div>
      </el-card>
      
      <el-menu :default-active="activeTool" class="tool-nav" mode="horizontal">
        <el-menu-item index="bip39" @click="activeTool = 'bip39'">
          <span>BIP39 助记词工具</span>
        </el-menu-item>
        <el-menu-item index="slip39" @click="activeTool = 'slip39'">
          <span>SLIP39 分片工具</span>
        </el-menu-item>
      </el-menu>
      
      <div class="main-content">
        <BIP39 
          v-if="activeTool === 'bip39'" 
          msg="BIP39 助记词备份还原工具"
          @bip39-to-slip39="handleBip39ToSlip39"
        />
        <SLIP39 
          v-if="activeTool === 'slip39'"
          :key="bip39Mnemonic"
          :bip39-mnemonic="bip39Mnemonic"
        />
      </div>
    </div>
  </el-config-provider>
</template>

<style scoped>
.app-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.version-card {
  margin-bottom: 20px;
}

.version-content {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.separator {
  color: var(--el-text-color-secondary);
  margin: 0 4px;
}

.hint {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.tool-nav {
  margin-bottom: 20px;
}

.main-content {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .version-content {
    font-size: 14px;
  }
  
  .hint {
    display: none;
  }
}
</style>
