# BIP39/SLIP39 助记词工具

这是一个比特币助记词生成、备份、还原的单页面工具。

## 功能特性

- ✅ **BIP39 助记词工具**
  - 生成 12/24 词助记词
  - 助记词验证
  - 从剪贴板粘贴助记词
  - 转换为 SLIP39 分片

- ✅ **SLIP39 分片工具**
  - 生成分片（支持多组配置）
  - 恢复助记词
  - 密码保护
  - 分片复制和粘贴

- ✅ **BIP39 和 SLIP39 互相转换**
- ✅ **支持离线使用**（构建后可作为单 HTML 文件使用）

## 技术栈

- Vue 3 + TypeScript
- Element Plus UI 组件库
- Vite 构建工具
- bip39 库（助记词生成）
- slip39 库（分片助记词）

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 项目结构

```
src/
├── components/
│   ├── bip39/           # BIP39 相关组件
│   │   ├── Mnemonic.vue # 助记词显示组件
│   │   └── WordInput.vue # 单词输入组件
│   ├── slip39/          # SLIP39 相关组件
│   │   ├── SLIP39.vue   # SLIP39 主组件
│   │   ├── ShareGenerator.vue # 分片生成组件
│   │   ├── ShareRecovery.vue  # 分片恢复组件
│   │   └── GroupConfig.vue    # 组配置组件
│   └── BIP39.vue        # BIP39 主组件
├── composables/
│   └── useBip39.ts      # BIP39 功能封装
├── polyfills/
│   └── crypto-shim.ts   # 浏览器 crypto polyfill
├── types/
│   └── bip39.ts         # BIP39 类型定义
├── App.vue              # 应用主组件
└── main.ts              # 应用入口

```

## 安全提示

⚠️ **重要安全提示**：
- 请在离线环境下使用此工具生成和管理助记词
- 永远不要在不安全的网络环境下输入或显示助记词
- 妥善保管你的助记词和分片
- 建议使用构建后的单 HTML 文件版本，在完全离线的环境中使用

## License

MIT
