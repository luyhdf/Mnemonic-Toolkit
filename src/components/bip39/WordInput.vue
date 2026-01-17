<script setup>
import { ref, watch } from 'vue'
import { useBip39 } from '../../composables/useBip39'
import { Check, Close, Key } from '@element-plus/icons-vue'

const props = defineProps({
  wordCount: {
    type: Number,
    required: true,
    default: 12
  },
  inputWords: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['word-added'])

// 使用 useBip39 composable
const {
  getSuggestions: getBip39Suggestions,
  isWordInWordlist,
  isValidPrefix,
  normalizeInput
} = useBip39()

const suggestions = ref([]) // 存储当前输入匹配的候选单词列表
const currentWordIndex = ref(0) // 当前选中的候选单词索引，用于Tab键切换
const currentInput = ref('') // 当前输入框中的文本内容
const isWordValid = ref(false) // 当前输入单词是否有效

const updateSuggestions = (input) => {
  if (!input) {
    suggestions.value = []
    return
  }
  suggestions.value = getBip39Suggestions(input, 8)
}

const handleInput = () => {
  // 清理和标准化输入
  currentInput.value = normalizeInput(currentInput.value)
  // 检查输入的前几个字母是否在词库中
  isWordValid.value = isValidPrefix(currentInput.value)
  updateSuggestions(currentInput.value)
}

const handleKeyDown = (event) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    if (suggestions.value.length > 0) {
      currentWordIndex.value = (currentWordIndex.value + 1) % suggestions.value.length
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (suggestions.value.length > 0) {
      // 如果有候选词，使用当前选中的候选词
      const selectedWord = suggestions.value[currentWordIndex.value]
      if (isWordInWordlist(selectedWord)) {
        emit('word-added', selectedWord)
        clearInput()
      }
    } else if (currentInput.value) {
      // 如果没有候选词，使用当前输入
      const word = currentInput.value.trim()
      if (isWordInWordlist(word)) {
        emit('word-added', word)
        clearInput()
      }
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    clearInput()
  }
}

const clearInput = () => {
  currentInput.value = ''
  suggestions.value = []
  currentWordIndex.value = 0
}

const handleSuggestionClick = (word) => {
  currentInput.value = word
  updateSuggestions(word)
  // 模拟按下 Enter 键确认输入
  const event = new KeyboardEvent('keydown', { key: 'Enter' })
  handleKeyDown(event)
}
</script>

<template>
  <el-card class="input-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>助记词输入</span>
      </div>
    </template>
    <div class="input-container">
      <div class="input-row">
        <el-descriptions class="input-hint" :column="1" size="large">
          <el-descriptions-item>
            输入第 <span class="hint-number">{{ inputWords.length + 1 }}</span>/<span class="hint-number">{{ wordCount }}</span> 个单词:
          </el-descriptions-item>
        </el-descriptions>
        <div class="input-box">  
          <el-input
            v-model="currentInput"
            @input="handleInput"
            @keydown="handleKeyDown"
            :placeholder="`请输入第 ${inputWords.length + 1} 个单词...`"
            class="input-text"
            size="large"
          >
            <template #append>
              <el-icon v-if="isWordValid" class="valid-icon"><Check /></el-icon>
              <el-icon v-else-if="currentInput" class="invalid-icon"><Close /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <div class="suggestions" v-if="suggestions.length > 0">
        <el-divider content-position="left">候选词</el-divider>
        <el-space wrap>
          <el-button
            v-for="(word, index) in suggestions"
            :key="index"
            :type="index === currentWordIndex ? 'success' : 'default'"
            :plain="index !== currentWordIndex"
            @click="() => handleSuggestionClick(word)"
            size="small"
          >
            {{ word }}
          </el-button>
        </el-space>
      </div>

      <el-divider content-position="left">快捷键</el-divider>
      <el-space wrap>
        <el-tag type="info" size="small">
          <el-icon class="icon"><Key /></el-icon>
          <span>Tab</span> 切换候选词
        </el-tag>
        <el-tag type="info" size="small">
          <el-icon class="icon"><Key /></el-icon>
          <span>Enter</span> 确认输入
        </el-tag>
        <el-tag type="info" size="small">
          <el-icon class="icon"><Key /></el-icon>
          <span>ESC</span> 清除输入
        </el-tag>
      </el-space>
    </div>
  </el-card>
</template>

<style scoped>
.input-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-container {
  padding: 10px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-hint {
  margin-bottom: 10px;
}

.hint-number {
  font-weight: bold;
  color: #409eff;
}

.input-box {
  width: 100%;
}

.input-text {
  width: 100%;
}

.valid-icon {
  color: #67c23a;
}

.invalid-icon {
  color: #f56c6c;
}

.suggestions {
  margin-top: 20px;
}

.icon {
  margin-right: 4px;
}
</style>
