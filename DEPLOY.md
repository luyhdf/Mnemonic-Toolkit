# 部署指南

本文档说明如何将 BIP39/SLIP39 助记词工具部署到 GitHub Pages。

## 📦 构建说明

项目支持两种构建模式：

### 1. 在线版本（多文件）
- 输出目录：`docs/`
- 特点：文件分离，加载速度快
- 适用场景：GitHub Pages 在线访问

```bash
pnpm run build:online
```

### 2. 离线版本（单文件）
- 输出目录：`docs/offline/`
- 特点：所有资源内联到单个 HTML 文件
- 适用场景：下载后离线使用，更安全

```bash
pnpm run build:offline
```

### 3. 完整构建（推荐）
同时构建在线版和离线版：

```bash
pnpm build
```

## 🚀 部署到 GitHub Pages

### 方法一：使用 GitHub Actions 自动部署（推荐）

1. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择：**GitHub Actions**

2. **推送代码**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **等待部署完成**
   - 在 Actions 标签页查看部署进度
   - 部署成功后，访问 `https://your-username.github.io/your-repo-name/`

### 方法二：手动部署

1. **构建项目**
   ```bash
   pnpm build
   ```

2. **提交构建文件**
   ```bash
   git add docs/
   git commit -m "Build for GitHub Pages"
   git push origin main
   ```

3. **配置 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择：**Deploy from a branch**
   - Branch 选择：**main**
   - Folder 选择：**/docs**
   - 点击 Save

4. **等待部署**
   - GitHub 会自动部署 docs 文件夹
   - 几分钟后访问 `https://your-username.github.io/your-repo-name/`

## 📁 文件结构

```
docs/
├── .nojekyll              # 告诉 GitHub Pages 不使用 Jekyll
├── index.html             # 在线版本入口
├── favicon.svg            # 网站图标
├── assets/                # 在线版本资源
│   ├── index-xxx.css      # 样式文件
│   └── index-xxx.js       # JavaScript 文件
└── offline/               # 离线版本
    ├── index.html         # 单文件版本（1.1MB）
    └── favicon.svg        # 网站图标
```

## 🔧 配置说明

### vite.config.ts 关键配置

```typescript
// 使用相对路径，适配 GitHub Pages
base: './',

// 根据环境变量决定输出目录
outDir: isSingleFile ? 'docs/offline' : 'docs',

// 单文件模式内联所有资源
assetsInlineLimit: isSingleFile ? 100000000 : 4096,
```

### package.json 构建脚本

```json
{
  "scripts": {
    "build": "pnpm run build:online && pnpm run build:offline",
    "build:online": "vite build",
    "build:offline": "BUILD_MODE=single vite build"
  }
}
```

## 🌐 环境检测

应用会自动检测运行环境：

- **在线环境**：通过 HTTP/HTTPS 协议访问
  - 显示"在线版本"标签
  - 提供"下载离线版本"按钮

- **离线环境**：通过 file:// 协议访问
  - 显示"离线版本"标签
  - 不显示下载按钮

检测代码：
```typescript
const isOffline = computed(() => {
  return window.location.protocol === 'file:'
})
```

## 🔒 安全建议

1. **使用离线版本**
   - 访问在线版本后，点击"下载离线版本"
   - 将下载的 HTML 文件保存到安全位置
   - 断开网络连接后使用

2. **验证文件完整性**
   - 检查文件大小约为 1.1MB
   - 可以在浏览器中打开查看是否正常工作

3. **安全存储**
   - 将离线版本保存在加密的 U 盘或硬盘中
   - 不要通过网络传输助记词

## 📝 更新部署

当代码更新后：

1. **自动部署**（使用 GitHub Actions）
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   ```
   GitHub Actions 会自动重新构建和部署

2. **手动部署**
   ```bash
   pnpm build
   git add docs/
   git commit -m "Update build"
   git push origin main
   ```

## 🐛 常见问题

### 1. 页面显示 404
- 检查 GitHub Pages 设置是否正确
- 确认 docs 文件夹已提交到仓库
- 等待几分钟让 GitHub 完成部署

### 2. 资源加载失败
- 确认 `vite.config.ts` 中 `base: './'` 配置正确
- 检查浏览器控制台的错误信息

### 3. 离线版本下载失败
- 确认 `docs/offline/index.html` 文件存在
- 检查浏览器是否阻止了下载

### 4. 功能在离线版本中不工作
- 确认使用的是最新构建的离线版本
- 检查浏览器控制台是否有错误
- 尝试在不同浏览器中测试

## 📊 构建产物大小

- **在线版本**
  - index.html: ~0.6KB
  - CSS: ~107KB (gzip: ~16KB)
  - JS: ~1024KB (gzip: ~345KB)
  - 总计: ~1.1MB (gzip: ~361KB)

- **离线版本**
  - index.html: ~1.1MB (gzip: ~362KB)
  - 所有资源已内联

## 🔗 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Vite 构建文档](https://vitejs.dev/guide/build.html)
- [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)
