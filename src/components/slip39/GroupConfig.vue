<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  groupThreshold: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'update:groupThreshold'])

const groups = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const threshold = computed({
  get: () => props.groupThreshold,
  set: (value) => emit('update:groupThreshold', value)
})

const addGroup = () => {
  const newGroups = [...groups.value, { threshold: 1, shares: 1 }]
  emit('update:modelValue', newGroups)
}

const removeGroup = (index) => {
  if (groups.value.length <= 1) return
  const newGroups = groups.value.filter((_, i) => i !== index)
  emit('update:modelValue', newGroups)
  
  // 确保组阈值不超过组数量
  if (threshold.value > newGroups.length) {
    emit('update:groupThreshold', newGroups.length)
  }
}

const updateGroupThreshold = (groupIndex, newThreshold) => {
  const newGroups = [...groups.value]
  newGroups[groupIndex] = { ...newGroups[groupIndex], threshold: newThreshold }
  emit('update:modelValue', newGroups)
}

const updateGroupShares = (groupIndex, newShares) => {
  const newGroups = [...groups.value]
  newGroups[groupIndex] = { ...newGroups[groupIndex], shares: newShares }
  emit('update:modelValue', newGroups)
}
</script>

<template>
  <div class="group-config-container">
    <el-form-item label="组阈值">
      <el-input-number 
        v-model="threshold" 
        :min="1" 
        :max="Math.min(16, groups.length)"
        style="width: 100%"
      ></el-input-number>
      <div class="help-text">需要至少 {{ threshold }} 个组才能恢复助记词</div>
    </el-form-item>
    
    <el-form-item label="组配置">
      <el-space direction="vertical" style="width: 100%">
        <div v-for="(group, index) in groups" :key="index" class="group-config">
          <el-space>
            <span>组 {{ index + 1 }}:</span>
            <el-input-number 
              :model-value="group.threshold"
              @update:model-value="updateGroupThreshold(index, $event)"
              :min="1" 
              :max="group.shares"
              placeholder="阈值"
              style="width: 100px"
            ></el-input-number>
            <span>of</span>
            <el-input-number 
              :model-value="group.shares"
              @update:model-value="updateGroupShares(index, $event)"
              :min="group.threshold" 
              :max="10"
              placeholder="分片数"
              style="width: 100px"
            ></el-input-number>
            <el-button 
              type="danger" 
              size="small" 
              @click="removeGroup(index)" 
              :disabled="groups.length <= 1"
            >
              删除
            </el-button>
          </el-space>
        </div>
        <el-button type="success" size="small" @click="addGroup">
          添加组
        </el-button>
      </el-space>
    </el-form-item>
  </div>
</template>

<style scoped>
.group-config-container {
  width: 100%;
}

.group-config {
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
