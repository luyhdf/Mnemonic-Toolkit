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
    <h1 class="main-title">{{ msg }}</h1>

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


