# 实现计划：BIP39助记词工具

## 概述

基于现有的Vue 3应用，通过模块化重构和功能补充，完善BIP39助记词生成、验证、转换和SLIP39分片管理功能。重点实现文件导入导出功能，并进行适度的组件拆分以提高代码可维护性。

## 任务

- [ ] 1. 实现文件操作功能
  - [ ] 1.1 创建文件操作工具函数
    - 实现助记词导出为JSON格式
    - 实现助记词导出为TXT格式
    - 实现从文件读取助记词
    - 实现文件格式验证
    - _需求: [待补充]_
  
  - [ ] 1.2 在BIP39组件中集成文件操作
    - 添加"导出到文件"按钮
    - 添加"从文件导入"按钮
    - 实现文件选择和读取逻辑
    - 显示导入导出状态提示
    - _需求: [待补充]_
  
  - [ ] 1.3 在SLIP39组件中集成文件操作
    - 添加"导出分片"按钮
    - 添加"导入分片"按钮
    - 支持批量导出所有分片
    - 支持从文件加载分片到恢复界面
    - _需求: [待补充]_

- [x] 2. 优化BIP39组件结构
  - [x] 2.1 提取单词输入逻辑为独立组件
    - 创建WordInput.vue组件
    - 迁移输入框、候选词、快捷键提示相关代码
    - 通过props和events与父组件通信
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [x] 2.2 简化BIP39.vue主组件
    - 移除已提取到子组件的代码
    - 保留组件协调逻辑
    - 优化组件间数据流
    - _需求: 2.1-2.9_

- [x] 3. 优化SLIP39组件结构
  - [x] 3.1 提取组配置为独立组件
    - 创建GroupConfig.vue组件
    - 迁移组阈值和组配置相关代码
    - 实现配置验证逻辑
    - _需求: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [x] 3.2 提取分片生成为独立组件
    - 创建ShareGenerator.vue组件
    - 迁移分片生成相关代码
    - 优化分片显示界面
    - _需求: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [x] 3.3 提取分片恢复为独立组件
    - 创建ShareRecovery.vue组件
    - 迁移分片恢复相关代码
    - 优化恢复界面和提示
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 4. 检查点 - 核心功能完成
  - 确保所有文件操作功能正常工作
  - 确保组件重构后功能无损
  - 确保现有功能不受影响
  - 如有问题请提出

- [ ] 5. 创建可复用的Composables
  - [x] 5.1 创建useBip39 composable
    - 提取BIP39相关逻辑（生成、验证、转换）
    - 实现候选词获取函数
    - 在组件中使用composable
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5, 2.8_
  
  - [ ] 5.2 创建useSlip39 composable
    - 提取SLIP39相关逻辑（生成分片、恢复）
    - 实现分片验证和解析函数
    - 在组件中使用composable
    - _需求: 6.1-6.9, 7.1-7.7_
  
  - [ ] 5.3 创建useClipboard composable
    - 实现剪贴板读写功能
    - 添加浏览器兼容性检测
    - 在组件中使用composable
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 5.4 创建useFileIO composable
    - 实现文件导出功能（JSON/TXT）
    - 实现文件读取功能
    - 实现文件格式验证
    - 在组件中使用composable
    - _需求: [待补充]_

- [ ] 6. 改进错误处理和用户提示
  - [ ] 6.1 统一错误提示样式
    - 使用Element Plus的Message组件
    - 定义统一的错误提示格式
    - 替换现有的console.error为用户友好提示
    - _需求: 所有需求的错误场景_
  
  - [ ] 6.2 添加操作成功提示
    - 文件导出成功提示
    - 文件导入成功提示
    - 分片生成成功提示
    - 恢复成功提示
    - _需求: 所有需求的成功场景_
  
  - [ ] 6.3 改进加载状态显示
    - 添加操作进行中的loading状态
    - 禁用操作按钮防止重复点击
    - 显示操作进度（如适用）
    - _需求: 12.1, 12.2_

- [ ] 7. 检查点 - 用户体验优化完成
  - 确保所有错误都有友好提示
  - 确保所有操作都有反馈
  - 确保界面响应流畅
  - 如有问题请提出

- [ ] 8. 添加单元测试
  - [ ] 8.1 设置测试环境
    - 安装Vitest和相关依赖
    - 配置vite.config.js测试选项
    - 创建测试目录结构
    - _需求: 测试策略_
  
  - [ ]* 8.2 编写Composables单元测试
    - 测试useBip39的所有函数
    - 测试useSlip39的所有函数
    - 测试useClipboard的所有函数
    - 测试useFileIO的所有函数
    - _需求: 1.1-1.5, 2.8, 4.1-4.5, 6.1-6.9, 7.1-7.7_
  
  - [ ]* 8.3 编写组件单元测试
    - 测试WordInput组件
    - 测试GroupConfig组件
    - 测试ShareGenerator组件
    - 测试ShareRecovery组件
    - _需求: 相关组件的所有需求_

- [ ] 9. 添加属性测试
  - [ ] 9.1 设置属性测试环境
    - 安装fast-check库
    - 创建属性测试文件
    - 配置测试运行参数（100次迭代）
    - _需求: 测试策略_
  
  - [ ]* 9.2 编写BIP39往返测试
    - **Property 2: BIP39助记词往返一致性**
    - **验证: 需求 5.5**
  
  - [ ]* 9.3 编写SLIP39往返测试
    - **Property 7: SLIP39往返恢复一致性**
    - **验证: 需求 7.2**
  
  - [ ]* 9.4 编写候选词匹配测试
    - **Property 3: 候选词前缀匹配**
    - **验证: 需求 2.1**
  
  - [ ]* 9.5 编写分片约束测试
    - **Property 8: 分片数量约束**
    - **Property 9: 组阈值约束**
    - **验证: 需求 6.9, 11.4, 11.5**
  
  - [ ]* 9.6 编写文件往返测试
    - **Property 14: 文件导出导入往返一致性**
    - **验证: 需求 [待补充]**

- [ ] 10. 检查点 - 测试完成
  - 确保所有单元测试通过
  - 确保所有属性测试通过
  - 确保测试覆盖率达标
  - 如有问题请提出

- [ ] 11. 优化样式和响应式设计
  - [ ] 11.1 补充缺失的组件样式
    - 检查并补充BIP39.vue的样式
    - 检查并补充Mnemonic.vue的样式
    - 确保新组件有完整样式
    - _需求: 3.1, 3.2_
  
  - [ ] 11.2 优化移动端适配
    - 调整按钮和输入框大小
    - 优化卡片布局
    - 测试不同屏幕尺寸
    - _需求: 14.2, 14.3_
  
  - [ ] 11.3 改进视觉反馈
    - 优化hover和active状态
    - 添加过渡动画
    - 统一颜色和间距
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 12. 最终检查点
  - 确保所有功能正常工作
  - 确保在线版和离线版都能正常使用
  - 确保所有测试通过
  - 确保代码质量和可维护性
  - 如有问题请提出

## 备注

- 任务标记`*`的为可选任务，可根据时间和优先级决定是否实现
- 文件操作功能是当前最重要的缺失功能，应优先实现
- 组件拆分应适度，避免过度工程化
- 测试应覆盖核心加密逻辑，确保数据安全
- 保持现有功能稳定，避免破坏性改动
- 每个检查点都应确保代码可运行且功能正常

## 实现顺序建议

1. **第一阶段**: 任务1（文件操作）- 补充核心缺失功能
2. **第二阶段**: 任务2-3（组件重构）- 提高代码质量
3. **第三阶段**: 任务5（Composables）- 提取可复用逻辑
4. **第四阶段**: 任务6（错误处理）- 改善用户体验
5. **第五阶段**: 任务8-9（测试）- 确保代码质量
6. **第六阶段**: 任务11（样式优化）- 完善界面

## 技术要点

### 文件操作实现

```javascript
// 导出JSON
const exportJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// 导出TXT
const exportTXT = (text, filename) => {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// 读取文件
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}
```

### Composable模式

```javascript
// src/composables/useBip39.js
import { ref } from 'vue'
import * as bip39 from 'bip39'

export function useBip39() {
  const generateMnemonic = (wordCount = 12) => {
    const strength = wordCount === 12 ? 128 : 256
    return bip39.generateMnemonic(strength)
  }
  
  const validateMnemonic = (mnemonic) => {
    return bip39.validateMnemonic(mnemonic)
  }
  
  const getSuggestions = (input, limit = 8) => {
    if (!input) return []
    return bip39.wordlists.english
      .filter(word => word.startsWith(input.toLowerCase()))
      .slice(0, limit)
  }
  
  return {
    generateMnemonic,
    validateMnemonic,
    getSuggestions
  }
}
```

### 组件拆分原则

1. 单一职责：每个组件只负责一个功能
2. 适度拆分：避免组件过小导致维护困难
3. 清晰接口：使用props和events明确组件边界
4. 可复用性：优先考虑逻辑复用而非组件复用
