<script setup>
import { ref, watch } from 'vue'
import { useSlip39 } from '../../composables/useSlip39'
import { useClipboard } from '../../composables/useClipboard'

const props = defineProps({
  initialShares: {
    type: Array,
    default: () => []
  },
  initialPassword: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['recovery-success', 'recovery-error'])

// 使用 useSlip39 composable
const { recoverSecret: recoverSecretComposable } = useSlip39()

// 使用 useClipboard composable
const { readFromClipboardSafe, writeToClipboardSafe } = useClipboard()

const password = ref('')
const recoveredMnemonic = ref('')
const inputShares = ref(['', '', ''])
const status = ref('')

// 监听传入的初始分片
watch(() => props.initialShares, (newShares) => {
  if (newShares && newShares.length > 0) {
    inputShares.value = [...newShares]
    console.log('Initial shares loaded:', inputShares.value)
  }
}, { immediate: true })

// 监听传入的初始密码
watch(() => props.initialPassword, (newPassword) => {
  if (newPassword) {
    password.value = newPassword
    console.log('Initial password loaded')
  }
}, { immediate: true })

const addShare = () => {
  inputShares.value.push('')
}

const removeShare = () => {
  if (inputShares.value.length > 1) {
    inputShares.value.pop()
  }
}

const clearShares = () => {
  inputShares.value = ['']
  recoveredMnemonic.value = ''
  status.value = ''
}

const pasteFromClipboard = async () => {
  const result = await readFromClipboardSafe()
  
  if (!result.success) {
    console.error('粘贴失败:', result.error)
    status.value = '粘贴失败，请检查剪贴板权限'
    return
  }

  const text = result.text
  if (text && text.trim()) {
    // 尝试解析多行分片
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length > 0) {
      inputShares.value = lines
      status.value = `已从剪贴板粘贴 ${lines.length} 个分片`
      setTimeout(() => {
        if (status.value.includes('已从剪贴板粘贴')) {
          status.value = ''
        }
      }, 2000)
    }
  }
}

const recoverMnemonic = () => {
  try {
    console.log('=== 开始恢复助记词 ===')
    
    // 使用 composable 恢复助记词
    const result = recoverSecretComposable(inputShares.value, password.value)
    
    if (result.success) {
      recoveredMnemonic.value = result.mnemonic
      console.log('恢复的BIP39助记词:', recoveredMnemonic.value)
      status.value = '恢复成功！'
      
      // 触发成功事件
      emit('recovery-success', recoveredMnemonic.value)
    } else {
      status.value = result.error || '恢复失败'
      console.error('恢复失败:', result.error)
      
      // 触发失败事件
      emit('recovery-error', new Error(result.error))
    }
    
    console.log('=== 恢复助记词完成 ===')
  } catch (error) {
    status.value = `恢复失败: ${error.message}`
    console.error('恢复失败:', error)
    
    // 触发失败事件
    emit('recovery-error', error)
  }
}

const copyRecoveredMnemonic = async () => {
  const result = await writeToClipboardSafe(recoveredMnemonic.value)
  
  if (result.success) {
    status.value = '助记词已复制到剪贴板'
    setTimeout(() => {
      if (status.value === '助记词已复制到剪贴板') {
        status.value = ''
      }
    }, 2000)
  } else {
    console.error('复制失败:', result.error)
    status.value = '复制失败，请手动复制'
  }
}
</script>

<template>
  <div class="share-recovery">
    <el-form label-position="top">
      <el-form-item label="输入分片">
        <el-space direction="vertical" style="width: 100%">
          <div v-for="(share, index) in inputShares" :key="index" class="share-input">
            <el-input 
              v-model="inputShares[index]" 
              placeholder="请输入分片"
              clearable
            >
              <template #prepend>{{ index + 1 }}</template>
            </el-input>
          </div>
          <el-space>
            <el-button type="primary" size="small" @click="addShare">添加分片</el-button>
            <el-button type="danger" size="small" @click="removeShare" :disabled="inputShares.length <= 1">
              删除分片
            </el-button>
            <el-button type="info" size="small" @click="pasteFromClipboard">
              从剪贴板粘贴
            </el-button>
            <el-button type="warning" size="small" @click="clearShares">
              清空
            </el-button>
          </el-space>
        </el-space>
      </el-form-item>
      
      <el-form-item label="密码 (如果生成时使用了密码)">
        <el-input 
          v-model="password" 
          placeholder="请输入密码" 
          show-password
        ></el-input>
        <div class="help-text">如果生成分片时使用了密码，恢复时必须输入相同的密码</div>
      </el-form-item>
      
      <el-form-item label="恢复设置">
        <el-button type="primary" @click="recoverMnemonic">恢复助记词</el-button>
      </el-form-item>
      
      <el-form-item v-if="recoveredMnemonic" label="恢复的助记词">
        <el-input 
          type="textarea" 
          v-model="recoveredMnemonic" 
          readonly 
          :rows="4"
        >
          <template #append>
            <el-button @click="copyRecoveredMnemonic" icon="DocumentCopy">复制</el-button>
          </template>
        </el-input>
        <div class="success-text">✓ 助记词恢复成功！请妥善保管</div>
      </el-form-item>
    </el-form>
    
    <div v-if="status" class="status">
      <el-alert 
        :message="status" 
        :type="status.includes('成功') ? 'success' : status.includes('失败') ? 'error' : 'info'" 
        show-icon 
        :closable="false"
      ></el-alert>
    </div>
  </div>
</template>

<style scoped>
.share-recovery {
  width: 100%;
}

.share-input {
  width: 100%;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.success-text {
  font-size: 14px;
  color: #67c23a;
  margin-top: 8px;
  font-weight: 500;
}

.status {
  margin-top: 16px;
}
</style>
