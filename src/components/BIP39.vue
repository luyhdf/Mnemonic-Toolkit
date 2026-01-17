<script setup>
import { ref } from 'vue'
import MnemonicDisplay from './bip39/Mnemonic.vue'
import WordInput from './bip39/WordInput.vue'

const props = defineProps({
  msg: String
})

const emit = defineEmits(['bip39-to-slip39'])

const wordCount = ref(12) // 助记词数量，可选12或24个单词
const inputWords = ref([]) // 存储已输入的单词数组

const handleWordAdded = (word) => {
  inputWords.value.push(word)
}

const handleWordsUpdate = (newWords) => {
  inputWords.value = newWords
}

const handleValidityUpdate = (isValid) => {
  // 可以在这里处理助记词有效性变化
}
</script>

<template>
  <el-card class="main-card" shadow="hover">
    <div class="header-section">
      <h1 class="main-title">{{ msg }}</h1>
      <el-radio-group v-model="wordCount" size="large" class="word-count-selector">
        <el-radio-button :value="12">12个单词</el-radio-button>
        <el-radio-button :value="24">24个单词</el-radio-button>
      </el-radio-group>
    </div>

    <MnemonicDisplay 
      :word-count="wordCount"
      @update:words="handleWordsUpdate"
      @update:isValid="handleValidityUpdate"
      @convert-to-slip39="(mnemonic) => emit('bip39-to-slip39', mnemonic)"
    />

    <WordInput
      :word-count="wordCount"
      :input-words="inputWords"
      @word-added="handleWordAdded"
    />
  </el-card>
</template>



<style lang="scss" scoped>
.main-card {
  margin: 20px 0;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.main-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;

  @media (max-width: 767px) {
    font-size: 20px;
  }
}

.word-count-selector {
  @media (max-width: 767px) {
    width: 100%;
    
    :deep(.el-radio-button) {
      flex: 1;
      
      .el-radio-button__inner {
        width: 100%;
      }
    }
  }
}
</style>
