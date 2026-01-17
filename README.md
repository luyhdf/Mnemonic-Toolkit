# Mnemonic Toolkit

> 安全的比特币助记词工具包 - 支持 BIP39 和 SLIP39 标准

这是一个专业的比特币助记词生成、备份、还原工具，支持在线和离线两种使用模式。

## 🌐 在线使用

- **在线版本**: [https://your-username.github.io/mnemonic-toolkit/](https://your-username.github.io/mnemonic-toolkit/)
- **离线版本**: 访问在线版本后点击"下载离线版本"按钮

## ✨ 功能特性

### BIP39 助记词工具
- ✅ 生成 12/24 词助记词
- ✅ 助记词验证
- ✅ 从剪贴板粘贴助记词
- ✅ 转换为 SLIP39 分片

### SLIP39 分片工具
- ✅ 生成分片（支持多组配置）
- ✅ 恢复助记词
- ✅ 密码保护
- ✅ 分片复制和粘贴

### 双模式支持
- ✅ **在线版本**：多文件加载，适合快速访问
- ✅ **离线版本**：单 HTML 文件（1.1MB），可在无网络环境下使用
- ✅ **BIP39 ⇄ SLIP39**：双向转换支持

## 🛠 技术栈

- Vue 3 + TypeScript
- Element Plus UI 组件库
- Vite 构建工具
- bip39 库（助记词生成）
- slip39 库（分片助记词）

## 📦 开发

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
# 构建在线版和离线版（推荐）
pnpm build

# 仅构建在线版
pnpm run build:online

# 仅构建离线版
pnpm run build:offline
```

构建后的文件：
- `docs/` - 在线版本（用于 GitHub Pages）
- `docs/offline/index.html` - 离线版本（单 HTML 文件）

### 预览生产构建

```bash
pnpm preview
```

## 🚀 部署到 GitHub Pages

### 方法一：自动部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
   - Settings → Pages
   - Source: GitHub Actions
3. 推送代码后会自动触发部署

### 方法二：手动部署

1. 构建项目：`pnpm build`
2. 提交 `docs` 文件夹到 Git
3. 在 GitHub 仓库设置中启用 GitHub Pages
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

## 📁 项目结构

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

docs/                    # GitHub Pages 部署目录
├── index.html           # 在线版本入口
├── assets/              # 在线版本资源文件
└── offline/
    └── index.html       # 离线版本（单文件）
```

## 🔒 安全提示

⚠️ **重要安全提示**：

- **强烈建议使用离线版本**：下载离线版本后，在完全断网的环境中使用
- 永远不要在不安全的网络环境下输入或显示助记词
- 妥善保管你的助记词和分片
- 不要截图或拍照保存助记词
- 建议使用纸笔抄写并保存在安全的地方
- 定期备份并验证你的助记词

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⭐ Star History

如果这个项目对你有帮助，请给它一个 Star ⭐
