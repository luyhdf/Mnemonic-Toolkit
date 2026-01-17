<script setup>
import { ref, watch } from 'vue'
import { useBip39 } from '../../composables/useBip39'
import { RefreshRight, DocumentCopy, Delete, Share } from '@element-plus/icons-vue'

const props = defineProps({
  wordCount: {
    type: Number,
    default: 12
  }
})

const emit = defineEmits(['update:words', 'update:isValid', 'convert-to-slip39'])

// 使用 useBip39 composable
const {
  generateMnemonic: generateMnemonicStr,
  validateMnemonic,
  parseMnemonicFromText,
  validateMnemonicArray
} = useBip39()

const words = ref([])
const isValid = ref(false)
const activeTab = ref('list') // 当前激活的标签页：list-列表形式，text-文本形式

const generateMnemonic = () => {
  const mnemonicStr = generateMnemonicStr(props.wordCount)
  words.value = mnemonicStr.split(' ')
  checkMnemonicValidity()
}

const checkMnemonicValidity = () => {
  if (words.value.length !== props.wordCount) {
    isValid.value = false
    return
  }

  const mnemonic = words.value.join(' ')
  isValid.value = validateMnemonic(mnemonic)
}

const clearMnemonic = () => {
  words.value = []
  isValid.value = false
}

const convertToSLIP39 = () => {
  console.log('convertToSLIP39 called')
  console.log('words.value:', words.value)
  console.log('words.value.length:', words.value.length)
  console.log('isValid.value:', isValid.value)
  if (words.value && words.value.length > 0 && isValid.value) {
    const mnemonicStr = words.value.join(' ')
    console.log('emitting convert-to-slip39 with mnemonic:', mnemonicStr)
    emit('convert-to-slip39', mnemonicStr)
  } else {
    console.log('convertToSLIP39: invalid state, not emitting event')
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    const newWords = parseMnemonicFromText(text)

    // 使用 validateMnemonicArray 验证助记词
    const validation = validateMnemonicArray(newWords, props.wordCount)
    
    if (!validation.isValid) {
      console.error('粘贴验证失败:', validation.errors)
      return
    }

    // 更新助记词
    words.value = newWords
    checkMnemonicValidity()
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

// 监听 words 变化
watch(words, () => {
  checkMnemonicValidity()
  emit('update:words', words.value)
  emit('update:isValid', isValid.value)
}, { deep: true })

// 初始化时生成助记词
generateMnemonic()
</script>

<template>
  <div class="mnemonic-display">
    <div class="control-row">
      <el-space>
        <el-button type="primary" size="large" @click="generateMnemonic">
          <el-icon><RefreshRight /></el-icon>
          <span>生成助记词</span>
        </el-button>
        <el-button type="success" size="large" @click="pasteFromClipboard">
          <el-icon><DocumentCopy /></el-icon>
          <span>从剪切板粘贴</span>
        </el-button>
        <el-button type="info" size="large" @click="convertToSLIP39" :disabled="!isValid">
          <el-icon><Share /></el-icon>
          <span>转换为SLIP39</span>
        </el-button>
        <el-button type="danger" size="large" @click="clearMnemonic">
          <el-icon><Delete /></el-icon>
          <span>清除列表</span>
        </el-button>
      </el-space>
    </div>

    <el-tabs v-model="activeTab" class="display-tabs">
      <el-tab-pane label="列表形式" name="list">
        <div class="mnemonic-words">
          <el-card
            v-for="index in wordCount"
            :key="index"
            class="word-card"
            shadow="hover"
            :body-style="{ padding: '10px' }"
          >
            <div class="mnemonic-word">
              <el-tag size="large" class="word-number">{{ index }}</el-tag>
              <span class="word-text">{{ words[index - 1] || '' }}</span>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文本形式" name="text">
        <el-input
          type="textarea"
          :rows="4"
          readonly
          :value="words.join(' ')">
        </el-input>
      </el-tab-pane>
    </el-tabs>

    <div class="hint">
      <el-descriptions :column="1" size="medium">
        <el-descriptions-item label="助记词状态">
          <el-tag :type="isValid ? 'success' : 'danger'" effect="dark">
            {{ isValid ? '有效' : '无效' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>


