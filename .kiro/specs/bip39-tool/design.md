# 设计文档

## 概述

本系统是一个基于Vue 3和Element Plus的单页面应用（SPA），使用Vite作为构建工具，集成bip39和slip39加密库，提供BIP39助记词生成、验证、转换和SLIP39分片管理功能。系统支持在线使用和离线单HTML文件模式，所有加密操作在客户端本地执行，确保用户数据安全。

## 技术栈

- **框架**: Vue 3 (Composition API with `<script setup>`)
- **语言**: JavaScript (ES6+)
- **构建工具**: Vite 6.3.3
- **UI 组件库**: Element Plus 2.13.1
- **图标库**: @element-plus/icons-vue 2.3.2
- **加密库**: 
  - bip39 3.1.0 (BIP39助记词标准实现)
  - slip39 0.1.9 (SLIP39分片标准实现)
- **构建插件**:
  - vite-plugin-singlefile 2.2.0 (单HTML文件打包)
  - vite-plugin-node-polyfills 0.24.0 (Node.js polyfills)
  - unplugin-auto-import 21.0.0 (自动导入)
  - unplugin-vue-components 31.0.0 (组件自动注册)
- **包管理器**: pnpm 10.12.4

## 架构

### 目录结构

```
bip39-vue/
├── src/
│   ├── main.js                    # 应用入口
│   ├── App.vue                    # 根组件，管理工具切换和版本显示
│   ├── components/
│   │   ├── BIP39.vue             # BIP39工具主组件
│   │   ├── bip39/
│   │   │   ├── Mnemonic.vue      # 助记词显示和管理组件
│   │   │   ├── WordInput.vue     # [待实现] 单词输入组件
│   │   │   └── FileOperations.vue # [待实现] 文件操作组件
│   │   └── slip39/
│   │       ├── SLIP39.vue        # SLIP39工具主组件
│   │       ├── ShareGenerator.vue # [待实现] 分片生成组件
│   │       ├── ShareRecovery.vue  # [待实现] 分片恢复组件
│   │       └── GroupConfig.vue    # [待实现] 组配置组件
│   ├── composables/              # [待实现] 可复用的组合式函数
│   │   ├── useBip39.js          # BIP39相关逻辑
│   │   ├── useSlip39.js         # SLIP39相关逻辑
│   │   ├── useClipboard.js      # 剪贴板操作
│   │   └── useFileIO.js         # 文件输入输出
│   └── utils/                    # [待实现] 工具函数
│       ├── validation.js         # 验证函数
│       └── conversion.js         # 转换函数
├── public/
│   └── favicon.ico               # 网站图标
├── docs/                         # 构建输出目录（多文件版本）
│   └── singleHtml/              # 单HTML文件版本输出
├── vite.config.js               # Vite配置
├── package.json                 # 项目配置
└── index.html                   # HTML模板
```

### 组件层次结构

```
App.vue (根组件)
├── el-card (版本信息卡片)
├── el-menu (工具导航菜单)
└── 条件渲染的工具组件
    ├── BIP39.vue (BIP39工具)
    │   ├── Mnemonic.vue (助记词显示)
    │   ├── WordInput.vue [待实现]
    │   └── FileOperations.vue [待实现]
    └── SLIP39.vue (SLIP39工具)
        ├── ShareGenerator.vue [待实现]
        ├── ShareRecovery.vue [待实现]
        └── GroupConfig.vue [待实现]
```

## 数据模型

### BIP39数据模型

```javascript
// 助记词状态
interface MnemonicState {
  words: string[]              // 助记词单词数组
  isValid: boolean            // 助记词是否有效
  wordCount: number           // 单词数量 (12 或 24)
  activeTab: 'list' | 'text'  // 当前显示模式
}

// 输入状态
interface InputState {
  currentInput: string        // 当前输入框内容
  suggestions: string[]       // 候选单词列表
  currentWordIndex: number    // 当前选中的候选词索引
  inputWords: string[]        // 已输入的单词列表
  isWordValid: boolean        // 当前输入是否有效
}

// 文件数据格式
interface MnemonicFile {
  version: string             // 文件格式版本
  type: 'BIP39'              // 助记词类型
  wordCount: number          // 单词数量
  mnemonic: string           // 助记词（空格分隔）
  timestamp: number          // 创建时间戳
}
```

### SLIP39数据模型

```javascript
// SLIP39配置
interface SLIP39Config {
  groupThreshold: number      // 组阈值 (1-16)
  groups: GroupConfig[]       // 组配置数组
  password: string           // 可选密码
  mnemonic: string           // 原始BIP39助记词
}

// 组配置
interface GroupConfig {
  threshold: number          // 组内阈值
  shares: number            // 分片数量
}

// 分片数据
interface ShareData {
  shares: string[]          // 生成的分片数组
  groupThreshold: number    // 组阈值
  timestamp: number         // 生成时间戳
}

// 恢复状态
interface RecoveryState {
  inputShares: string[]     // 输入的分片
  password: string          // 密码
  recoveredMnemonic: string // 恢复的助记词
  status: string           // 状态信息
}

// 分片文件格式
interface ShareFile {
  version: string           // 文件格式版本
  type: 'SLIP39'           // 类型标识
  groupThreshold: number   // 组阈值
  shares: string[]         // 分片数组
  timestamp: number        // 创建时间戳
  hasPassword: boolean     // 是否使用密码
}
```

### 应用状态

```javascript
// 全局应用状态
interface AppState {
  activeTool: 'bip39' | 'slip39'  // 当前激活的工具
  bip39Mnemonic: string           // 用于传递的BIP39助记词
  isSingleFile: boolean           // 是否为单文件模式
}
```

## 组件与接口

### 核心组件设计

#### 1. App.vue (根组件)

**职责**:
- 管理工具切换（BIP39/SLIP39）
- 显示版本信息（在线/离线）
- 处理单HTML文件下载
- 在BIP39和SLIP39组件间传递数据

**Props**: 无

**Events**: 无

**Methods**:
- `downloadSingleFile()`: 下载单HTML文件
- `handleBip39ToSlip39(mnemonic)`: 处理BIP39转SLIP39事件

#### 2. BIP39.vue (BIP39工具主组件)

**职责**:
- 协调助记词输入和显示
- 管理助记词输入逻辑
- 提供候选词提示
- 触发转换到SLIP39

**Props**:
- `msg: String` - 标题文本

**Events**:
- `bip39-to-slip39(mnemonic: string)` - 转换到SLIP39事件

**Methods**:
- `updateSuggestions(input)`: 更新候选词列表
- `handleInput()`: 处理输入事件
- `handleKeyDown(event)`: 处理键盘事件
- `handleSuggestionClick(word)`: 处理候选词点击
- `clearInput()`: 清除输入

**Data**:
- `wordCount`: 助记词数量
- `suggestions`: 候选词列表
- `currentWordIndex`: 当前选中索引
- `inputWords`: 已输入单词
- `currentInput`: 当前输入
- `isWordValid`: 输入有效性

#### 3. Mnemonic.vue (助记词显示组件)

**职责**:
- 生成BIP39助记词
- 显示助记词（列表/文本模式）
- 验证助记词有效性
- 剪贴板操作
- 触发转换到SLIP39

**Props**:
- `wordCount: Number` - 助记词数量 (默认12)

**Events**:
- `update:words(words: string[])` - 助记词更新
- `update:isValid(isValid: boolean)` - 有效性更新
- `convert-to-slip39(mnemonic: string)` - 转换事件

**Methods**:
- `generateMnemonic()`: 生成助记词
- `checkMnemonicValidity()`: 验证助记词
- `clearMnemonic()`: 清除助记词
- `convertToSLIP39()`: 转换到SLIP39
- `pasteFromClipboard()`: 从剪贴板粘贴

**Data**:
- `words`: 助记词数组
- `isValid`: 有效性标志
- `activeTab`: 当前标签页

#### 4. SLIP39.vue (SLIP39工具主组件)

**职责**:
- 管理SLIP39分片生成和恢复
- 配置组和阈值
- 处理密码加密
- 提供测试功能

**Props**:
- `bip39Mnemonic: String` - 传入的BIP39助记词

**Events**: 无

**Methods**:
- `generateShares()`: 生成分片
- `recoverMnemonic()`: 恢复助记词
- `jumpToRecoverTest()`: 跳转到恢复测试

**Data**:
- `activeTab`: 当前标签页
- `groupThreshold`: 组阈值
- `groups`: 组配置数组
- `password`: 密码
- `mnemonic`: 助记词
- `generatedShares`: 生成的分片
- `recoveredMnemonic`: 恢复的助记词
- `inputShares`: 输入的分片
- `status`: 状态信息

### 待实现组件

#### 5. FileOperations.vue (文件操作组件)

**职责**:
- 导出助记词到文件（JSON/TXT）
- 从文件导入助记词
- 导出SLIP39分片
- 导入SLIP39分片

**Props**:
- `data: Object` - 要导出的数据
- `type: 'bip39' | 'slip39'` - 数据类型

**Events**:
- `import-success(data: Object)` - 导入成功
- `import-error(error: Error)` - 导入失败

**Methods**:
- `exportToJSON()`: 导出为JSON
- `exportToTXT()`: 导出为TXT
- `importFromFile()`: 从文件导入
- `validateFileFormat()`: 验证文件格式

#### 6. ShareGenerator.vue (分片生成组件)

**职责**:
- 配置分片参数
- 生成分片
- 显示生成的分片

**Props**:
- `mnemonic: String` - BIP39助记词

**Events**:
- `shares-generated(shares: string[])` - 分片生成完成

#### 7. ShareRecovery.vue (分片恢复组件)

**职责**:
- 输入分片
- 恢复助记词
- 显示恢复结果

**Props**:
- `password: String` - 密码

**Events**:
- `recovery-success(mnemonic: string)` - 恢复成功
- `recovery-error(error: Error)` - 恢复失败

#### 8. GroupConfig.vue (组配置组件)

**职责**:
- 配置组数量
- 设置组阈值
- 设置每组的分片数

**Props**:
- `modelValue: GroupConfig[]` - 组配置

**Events**:
- `update:modelValue(config: GroupConfig[])` - 配置更新

### Composables (可复用逻辑)

#### useBip39.js

```javascript
export function useBip39() {
  // 生成助记词
  const generateMnemonic = (wordCount = 12) => { }
  
  // 验证助记词
  const validateMnemonic = (mnemonic) => { }
  
  // 助记词转熵
  const mnemonicToEntropy = (mnemonic) => { }
  
  // 熵转助记词
  const entropyToMnemonic = (entropy) => { }
  
  // 获取候选词
  const getSuggestions = (input) => { }
  
  return {
    generateMnemonic,
    validateMnemonic,
    mnemonicToEntropy,
    entropyToMnemonic,
    getSuggestions
  }
}
```

#### useSlip39.js

```javascript
export function useSlip39() {
  // 生成分片
  const generateShares = (entropy, config) => { }
  
  // 恢复助记词
  const recoverSecret = (shares, password) => { }
  
  // 验证分片
  const validateShare = (share) => { }
  
  // 解析分片信息
  const parseShareInfo = (share) => { }
  
  return {
    generateShares,
    recoverSecret,
    validateShare,
    parseShareInfo
  }
}
```

#### useClipboard.js

```javascript
export function useClipboard() {
  // 复制到剪贴板
  const copyToClipboard = async (text) => { }
  
  // 从剪贴板读取
  const readFromClipboard = async () => { }
  
  // 检查剪贴板API支持
  const isSupported = () => { }
  
  return {
    copyToClipboard,
    readFromClipboard,
    isSupported
  }
}
```

#### useFileIO.js

```javascript
export function useFileIO() {
  // 导出为JSON
  const exportJSON = (data, filename) => { }
  
  // 导出为TXT
  const exportTXT = (text, filename) => { }
  
  // 读取文件
  const readFile = (file) => { }
  
  // 验证文件格式
  const validateFileFormat = (data, type) => { }
  
  return {
    exportJSON,
    exportTXT,
    readFile,
    validateFileFormat
  }
}
```

## 正确性属性

*正确性属性是指在系统所有有效执行中都应保持为真的特性或行为。这些属性将通过属性测试（Property-Based Testing）来验证。*

### Property 1: BIP39助记词生成有效性

*对于任意*生成的BIP39助记词，使用bip39.validateMnemonic()验证应返回true。

**验证: 需求 1.3**

### Property 2: BIP39助记词往返一致性

*对于任意*有效的BIP39助记词，将其转换为熵再转换回助记词，应得到等价的助记词。

**验证: 需求 5.5**

### Property 3: 候选词前缀匹配

*对于任意*输入字符串，返回的候选词列表中的每个单词都应以该输入字符串开头（不区分大小写）。

**验证: 需求 2.1**

### Property 4: 词表单词验证

*对于任意*输入的单词，如果该单词在BIP39标准词表中，则isWordValid应为true；否则应为false。

**验证: 需求 2.8**

### Property 5: 助记词数量约束

*对于任意*生成或验证的助记词，其单词数量必须为12或24。

**验证: 需求 1.1, 1.5**

### Property 6: SLIP39分片生成成功性

*对于任意*有效的BIP39助记词和有效的组配置，生成SLIP39分片应成功且返回非空分片数组。

**验证: 需求 6.2, 6.6**

### Property 7: SLIP39往返恢复一致性

*对于任意*有效的BIP39助记词，生成SLIP39分片后使用足够数量的分片恢复，应得到原始助记词。

**验证: 需求 7.2**

### Property 8: 分片数量约束

*对于任意*组配置，每个组的分片数量必须大于等于该组的阈值。

**验证: 需求 6.9, 11.5**

### Property 9: 组阈值约束

*对于任意*SLIP39配置，组阈值必须在1到组数量之间。

**验证: 需求 6.4, 11.4**

### Property 10: 密码一致性

*对于任意*使用密码生成的SLIP39分片，恢复时必须使用相同的密码才能成功恢复。

**验证: 需求 6.3, 7.3**

### Property 11: 分片不足恢复失败

*对于任意*SLIP39分片集合，如果提供的分片数量少于阈值要求，恢复操作应失败。

**验证: 需求 7.4**

### Property 12: 剪贴板粘贴单词数量验证

*对于任意*从剪贴板粘贴的文本，如果单词数量不等于预期的wordCount，粘贴操作应被拒绝。

**验证: 需求 4.3**

### Property 13: 剪贴板粘贴词表验证

*对于任意*从剪贴板粘贴的文本，如果包含不在BIP39词表中的单词，粘贴操作应被拒绝。

**验证: 需求 4.4**

### Property 14: 文件导出导入往返一致性

*对于任意*助记词或分片数据，导出到文件后再导入，应得到相同的数据。

**验证: 需求 [待补充文件操作需求]**

### Property 15: 熵强度正确性

*对于任意*12词助记词，其熵强度应为128位；对于24词助记词，其熵强度应为256位。

**验证: 需求 1.5**

## 错误处理

### 错误类型

#### 1. 输入验证错误

**场景**: 用户输入无效数据

**处理方式**:
- 实时显示输入有效性（绿色勾号/红色叉号）
- 禁用相关操作按钮
- 显示友好的错误提示信息
- 不允许无效数据进入系统

**示例**:
- 输入不在词表中的单词
- 助记词数量不正确
- 分片格式无效

#### 2. 加密操作错误

**场景**: BIP39或SLIP39库操作失败

**处理方式**:
- 捕获异常并显示具体错误信息
- 记录错误到控制台（开发模式）
- 保持系统状态不变
- 提供重试选项

**示例**:
- BIP39助记词转熵失败
- SLIP39分片生成失败
- 分片恢复失败

#### 3. 文件操作错误

**场景**: 文件读写失败

**处理方式**:
- 显示文件操作错误提示
- 验证文件格式和内容
- 提供详细的错误原因
- 不影响现有数据

**示例**:
- 文件格式不正确
- 文件内容损坏
- 浏览器不支持文件API

#### 4. 剪贴板操作错误

**场景**: 剪贴板API调用失败

**处理方式**:
- 检测浏览器支持情况
- 显示权限请求提示
- 提供备用方案（手动复制粘贴）
- 静默失败，不中断用户操作

**示例**:
- 浏览器不支持Clipboard API
- 用户拒绝剪贴板权限
- 剪贴板内容为空

#### 5. 网络错误

**场景**: 下载单HTML文件失败

**处理方式**:
- 显示下载失败提示
- 提供重试按钮
- 记录错误信息
- 不影响其他功能

**示例**:
- 网络连接中断
- 文件不存在
- 服务器错误

### 错误处理原则

1. **用户友好**: 使用通俗易懂的语言描述错误
2. **不丢失数据**: 错误不应导致用户数据丢失
3. **可恢复**: 提供明确的恢复路径
4. **安全优先**: 敏感操作失败时保持保守策略
5. **日志记录**: 开发模式下记录详细错误信息

## 测试策略

### 单元测试

**工具**: Vitest (推荐用于Vite项目)

**范围**:
- **Composables测试**:
  - `useBip39.js`: 测试助记词生成、验证、转换函数
  - `useSlip39.js`: 测试分片生成、恢复函数
  - `useClipboard.js`: 测试剪贴板操作（使用mock）
  - `useFileIO.js`: 测试文件读写操作（使用mock）

- **工具函数测试**:
  - `validation.js`: 测试各种验证函数
  - `conversion.js`: 测试数据转换函数

- **组件测试**:
  - 测试组件的props、events、methods
  - 测试用户交互（点击、输入、键盘事件）
  - 测试条件渲染和状态变化

**示例测试用例**:
```javascript
// useBip39.test.js
describe('useBip39', () => {
  it('should generate valid 12-word mnemonic', () => {
    const { generateMnemonic, validateMnemonic } = useBip39()
    const mnemonic = generateMnemonic(12)
    expect(mnemonic.split(' ')).toHaveLength(12)
    expect(validateMnemonic(mnemonic)).toBe(true)
  })
  
  it('should reject invalid mnemonic', () => {
    const { validateMnemonic } = useBip39()
    expect(validateMnemonic('invalid mnemonic words')).toBe(false)
  })
})
```

### 属性测试 (Property-Based Testing)

**工具**: fast-check (JavaScript属性测试库)

**配置**: 每个测试至少运行100次迭代

**范围**:
- **BIP39往返测试**: 验证助记词↔熵转换的一致性
- **SLIP39往返测试**: 验证BIP39↔SLIP39↔BIP39的一致性
- **候选词匹配测试**: 验证所有候选词都以输入前缀开头
- **分片恢复测试**: 验证足够数量的分片能恢复原始助记词
- **文件往返测试**: 验证导出导入的数据一致性

**示例属性测试**:
```javascript
// bip39.property.test.js
import fc from 'fast-check'

describe('BIP39 Properties', () => {
  // Feature: bip39-tool, Property 2: BIP39助记词往返一致性
  it('should maintain consistency in mnemonic-entropy-mnemonic conversion', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1 }).map(i => i === 0 ? 12 : 24),
        (wordCount) => {
          const { generateMnemonic, mnemonicToEntropy, entropyToMnemonic } = useBip39()
          const original = generateMnemonic(wordCount)
          const entropy = mnemonicToEntropy(original)
          const recovered = entropyToMnemonic(entropy)
          return original === recovered
        }
      ),
      { numRuns: 100 }
    )
  })
  
  // Feature: bip39-tool, Property 7: SLIP39往返恢复一致性
  it('should recover original mnemonic from SLIP39 shares', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }), // groupThreshold
        fc.array(
          fc.record({
            threshold: fc.integer({ min: 1, max: 3 }),
            shares: fc.integer({ min: 1, max: 5 })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        (groupThreshold, groups) => {
          // 确保每个组的shares >= threshold
          const validGroups = groups.map(g => ({
            threshold: g.threshold,
            shares: Math.max(g.shares, g.threshold)
          }))
          
          const { generateMnemonic } = useBip39()
          const { generateShares, recoverSecret } = useSlip39()
          
          const original = generateMnemonic(12)
          const shares = generateShares(original, {
            groupThreshold: Math.min(groupThreshold, validGroups.length),
            groups: validGroups,
            password: ''
          })
          
          // 选择足够数量的分片
          const selectedShares = selectMinimalShares(shares, groupThreshold)
          const recovered = recoverSecret(selectedShares, '')
          
          return original === recovered
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### 集成测试

**工具**: Vitest + @vue/test-utils

**范围**:
- **端到端流程测试**:
  - BIP39生成 → 显示 → 转换SLIP39 → 恢复
  - 文件导出 → 导入 → 验证
  - 剪贴板复制 → 粘贴 → 验证

- **组件集成测试**:
  - App.vue与子组件的交互
  - BIP39.vue与Mnemonic.vue的数据传递
  - SLIP39.vue的生成和恢复流程

**示例集成测试**:
```javascript
// bip39-to-slip39.integration.test.js
describe('BIP39 to SLIP39 Integration', () => {
  it('should convert BIP39 to SLIP39 and recover', async () => {
    const wrapper = mount(App)
    
    // 生成BIP39助记词
    await wrapper.find('[data-test="generate-mnemonic"]').trigger('click')
    const mnemonic = wrapper.vm.bip39Mnemonic
    
    // 转换到SLIP39
    await wrapper.find('[data-test="convert-to-slip39"]').trigger('click')
    expect(wrapper.vm.activeTool).toBe('slip39')
    
    // 生成分片
    await wrapper.find('[data-test="generate-shares"]').trigger('click')
    const shares = wrapper.vm.generatedShares
    expect(shares.length).toBeGreaterThan(0)
    
    // 恢复助记词
    await wrapper.find('[data-test="jump-to-recover"]').trigger('click')
    await wrapper.find('[data-test="recover-mnemonic"]').trigger('click')
    const recovered = wrapper.vm.recoveredMnemonic
    
    expect(recovered).toBe(mnemonic)
  })
})
```

### 测试覆盖率目标

- **单元测试覆盖率**: ≥ 80%
- **属性测试**: 覆盖所有15个正确性属性
- **集成测试**: 覆盖所有主要用户流程

### 测试执行

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行属性测试
pnpm test:property

# 运行集成测试
pnpm test:integration

# 生成覆盖率报告
pnpm test:coverage
```

## 安全考虑

### 1. 客户端加密

- 所有加密操作在浏览器本地执行
- 不向服务器发送任何敏感数据
- 使用经过验证的加密库（bip39、slip39）

### 2. 内存安全

- 避免在控制台输出敏感信息（生产模式）
- 及时清理不再使用的敏感数据
- 使用Vue的响应式系统管理状态

### 3. 离线支持

- 单HTML文件模式完全离线运行
- 所有依赖打包到单个文件中
- 不依赖外部CDN或API

### 4. 输入验证

- 严格验证所有用户输入
- 使用BIP39标准词表白名单
- 防止注入攻击

## 性能优化

### 1. 代码分割

- 使用Vite的动态导入
- 按需加载大型组件
- 优化打包体积

### 2. 响应式优化

- 使用`computed`缓存计算结果
- 避免不必要的响应式转换
- 使用`shallowRef`处理大型数据

### 3. 渲染优化

- 使用`v-show`代替`v-if`（频繁切换）
- 使用虚拟滚动（如果列表很长）
- 避免深层嵌套的响应式对象

### 4. 构建优化

- 启用代码压缩和混淆
- 使用Tree Shaking移除未使用代码
- 优化Element Plus按需导入

## 部署方案

### 在线版本

1. 构建多文件版本: `pnpm run build:multi`
2. 输出到`docs/`目录
3. 推送到GitHub
4. 通过GitHub Pages访问

### 离线版本

1. 构建单文件版本: `pnpm run build:single`
2. 输出到`docs/singleHtml/`目录
3. 用户可下载`index.html`文件
4. 双击HTML文件即可在浏览器中使用

### CI/CD

建议使用GitHub Actions自动化构建和部署：

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## 未来扩展

### 短期计划

1. 实现文件导入/导出功能
2. 添加更多语言支持（中文词表）
3. 改进移动端体验
4. 添加助记词强度指示器

### 长期计划

1. 支持硬件钱包集成
2. 支持多种助记词标准（BIP32、BIP44等）
3. 添加助记词加密存储
4. 支持二维码导入导出
5. 添加助记词恢复提示功能

