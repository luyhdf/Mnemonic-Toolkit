<script setup>
import { ref, watch } from 'vue'
import Slip39 from 'slip39'
import * as bip39 from 'bip39'
import GroupConfig from './GroupConfig.vue'

const props = defineProps({
  bip39Mnemonic: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['shares-generated', 'jump-to-recover'])

const groupThreshold = ref(2)
const groups = ref([
  { threshold: 1, shares: 1 },
  { threshold: 1, shares: 1 },
  { threshold: 1, shares: 1 }
])
const password = ref('')
const mnemonic = ref('')
const generatedShares = ref([])
const status = ref('')

// 定义 generateShares 函数
const generateShares = () => {
  try {
    console.log('=== 开始生成分片 ===')
    console.log('输入的BIP39助记词:', mnemonic.value)
    
    // 检查助记词是否为空
    if (!mnemonic.value || mnemonic.value.trim() === '') {
      throw new Error('助记词不能为空')
    }
    
    // 1. 将BIP39助记词转换为熵字节数组
    let entropy
    try {
      entropy = bip39.mnemonicToEntropy(mnemonic.value)
      console.log('转换后的熵 (hex):', entropy)
    } catch (entropyError) {
      throw new Error(`BIP39助记词无效: ${entropyError.message}`)
    }
    
    // 检查entropy是否有效
    if (!entropy) {
      throw new Error('无法将助记词转换为熵')
    }
    
    // 2. 转换为普通数组（不是Uint8Array！）
    const entropyBytes = entropy.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    console.log('转换后的熵 (Array):', entropyBytes)
    console.log('熵字节长度:', entropyBytes.length)
    
    // 3. 确保groups是一个数组
    const groupConfigs = (groups.value || []).map(g => [g.threshold, g.shares])
    console.log('组配置:', groupConfigs)
    
    // 4. 使用Slip39.fromArray方法生成分片
    const slip39node = Slip39.fromArray(entropyBytes, {
      passphrase: password.value,
      threshold: groupThreshold.value,
      groups: groupConfigs
    })
    
    // 5. 检查slip39node.root是否存在
    if (!slip39node || !slip39node.root) {
      throw new Error('生成分片失败: 无法获取root节点')
    }
    
    // 6. 获取所有分片
    generatedShares.value = slip39node.root.mnemonics || []
    console.log('生成的SLIP39分片:', generatedShares.value)
    status.value = '生成成功！'
    
    // 触发事件通知父组件
    emit('shares-generated', {
      shares: generatedShares.value,
      password: password.value,
      groupThreshold: groupThreshold.value
    })
    
    console.log('=== 生成分片完成 ===')
  } catch (error) {
    status.value = `生成失败: ${error.message}`
    generatedShares.value = []
    console.error('生成失败:', error)
  }
}

const jumpToRecoverTest = () => {
  try {
    console.log('jumpToRecoverTest called')
    
    // 选择足够数量的分片用于测试
    const shares = generatedShares.value || []
    const selectedShares = []
    const groupSet = new Set()
    
    // 遍历所有分片，每个组只取一个分片
    shares.forEach(share => {
      const groupIdMatch = share.match(/group-id=(\d+)/)
      if (groupIdMatch && groupIdMatch[1]) {
        const groupId = groupIdMatch[1]
        if (!groupSet.has(groupId)) {
          selectedShares.push(share)
          groupSet.add(groupId)
          // 如果已经收集了足够数量的组，就停止
          if (selectedShares.length >= groupThreshold.value) {
            return false
          }
        }
      } else {
        // 如果无法解析group-id，就只取前groupThreshold个分片
        if (selectedShares.length < groupThreshold.value) {
          selectedShares.push(share)
        }
      }
    })
    
    console.log('Selected shares:', selectedShares)
    
    // 触发事件通知父组件切换到恢复标签页
    emit('jump-to-recover', {
      shares: selectedShares,
      password: password.value
    })
    
    console.log('jumpToRecoverTest completed')
  } catch (error) {
    console.error('jumpToRecoverTest failed:', error)
    status.value = `跳转失败: ${error.message}`
  }
}

const copyShare = async (share) => {
  try {
    await navigator.clipboard.writeText(share)
    status.value = '分片已复制到剪贴板'
    setTimeout(() => {
      if (status.value === '分片已复制到剪贴板') {
        status.value = ''
      }
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    status.value = '复制失败，请手动复制'
  }
}

// 监听传入的BIP39助记词（在所有函数定义之后）
watch(() => props.bip39Mnemonic, (newValue) => {
  console.log('props.bip39Mnemonic changed to:', newValue)
  if (newValue && typeof newValue === 'string' && newValue.trim()) {
    mnemonic.value = newValue
    console.log('mnemonic.value updated to:', mnemonic.value)
    // 自动生成分片
    generateShares()
  }
}, { immediate: true })
</script>

<template>
  <div class="share-generator">
    <el-form label-position="top">
      <el-form-item label="原始助记词">
        <el-input 
          type="textarea" 
          v-model="mnemonic" 
          placeholder="请输入BIP39助记词" 
          :rows="4"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="密码 (可选)">
        <el-input 
          v-model="password" 
          placeholder="请输入密码" 
          show-password
        ></el-input>
        <div class="help-text">使用密码可以增加额外的安全层</div>
      </el-form-item>
      
      <GroupConfig 
        v-model="groups"
        v-model:group-threshold="groupThreshold"
      />
      
      <el-form-item label="生成设置">
        <el-button type="primary" @click="generateShares">生成分片</el-button>
      </el-form-item>
      
      <el-form-item v-if="generatedShares.length > 0" label="生成的分片">
        <el-space direction="vertical" style="width: 100%">
          <div v-for="(share, index) in generatedShares" :key="index" class="share-item">
            <el-input 
              :value="share" 
              readonly 
              placeholder="分片"
            >
              <template #append>
                <el-button @click="copyShare(share)" icon="DocumentCopy">复制</el-button>
              </template>
            </el-input>
          </div>
          <el-button 
            type="warning" 
            size="small" 
            @click="jumpToRecoverTest"
          >
            跳转到还原测试
          </el-button>
        </el-space>
      </el-form-item>
    </el-form>
    
    <div v-if="status" class="status">
      <el-alert :message="status" type="info" show-icon :closable="false"></el-alert>
    </div>
  </div>
</template>

<style scoped>
.share-generator {
  width: 100%;
}

.share-item {
  width: 100%;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.status {
  margin-top: 16px;
}
</style>
