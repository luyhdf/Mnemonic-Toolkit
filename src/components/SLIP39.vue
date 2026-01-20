<script setup>
import { ref, watch } from 'vue'
import ShareGenerator from './slip39/ShareGenerator.vue'
import ShareRecovery from './slip39/ShareRecovery.vue'

const props = defineProps({
  bip39Mnemonic: {
    type: [String, null, undefined],
    default: ''
  }
})

const activeTab = ref('generate')
const recoveryShares = ref([])
const recoveryPassword = ref('')

// 添加调试日志
console.log('SLIP39 component mounted with bip39Mnemonic:', props.bip39Mnemonic)

// 监听 prop 变化
watch(() => props.bip39Mnemonic, (newValue) => {
  console.log('SLIP39: bip39Mnemonic changed to:', newValue)
}, { immediate: true })

// 处理分片生成完成事件
const handleSharesGenerated = (data) => {
  console.log('Shares generated:', data)
}

// 处理跳转到恢复测试事件
const handleJumpToRecover = (data) => {
  console.log('Jump to recover with data:', data)
  recoveryShares.value = data.shares
  recoveryPassword.value = data.password
  activeTab.value = 'recover'
}

// 处理恢复成功事件
const handleRecoverySuccess = (mnemonic) => {
  console.log('Recovery successful:', mnemonic)
}

// 处理恢复失败事件
const handleRecoveryError = (error) => {
  console.error('Recovery failed:', error)
}
</script>

<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">
        <span>SLIP39 助记词分片工具</span>
      </div>
    </template>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="生成分片" name="generate">
        <ShareGenerator 
          :bip39-mnemonic="props.bip39Mnemonic"
          @shares-generated="handleSharesGenerated"
          @jump-to-recover="handleJumpToRecover"
        />
      </el-tab-pane>
      
      <el-tab-pane label="恢复助记词" name="recover">
        <ShareRecovery 
          :initial-shares="recoveryShares"
          :initial-password="recoveryPassword"
          @recovery-success="handleRecoverySuccess"
          @recovery-error="handleRecoveryError"
        />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>