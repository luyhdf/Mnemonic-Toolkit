<script setup lang="ts">
import { ref } from 'vue'
import BIP39 from './components/BIP39.vue'
import SLIP39 from './components/SLIP39.vue'
import AppHeader from './components/AppHeader.vue'

const activeTool = ref('bip39')
const bip39Mnemonic = ref('') // 存储BIP39助记词，用于传递给SLIP39组件

const handleBip39ToSlip39 = (mnemonic: string) => {
  console.log('handleBip39ToSlip39 called with mnemonic:', mnemonic)
  bip39Mnemonic.value = mnemonic
  activeTool.value = 'slip39'
  console.log('activeTool changed to:', activeTool.value)
  console.log('bip39Mnemonic set to:', bip39Mnemonic.value)
}
</script>

<template>
  <el-config-provider namespace="ep">
    <div class="app-container">
      <!-- Header组件 -->
      <AppHeader />
      
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

.tool-nav {
  margin-bottom: 20px;
}

.main-content {
  margin-top: 20px;
}
</style>
