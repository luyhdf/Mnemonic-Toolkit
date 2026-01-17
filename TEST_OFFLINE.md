# 测试离线版本

## 文件位置

- **在线版本**: `docs/index.html` - 用于GitHub Pages部署
- **离线版本**: `docs/offline/index.html` - 单文件，可离线使用

## 测试步骤

### 1. 测试离线版本

在浏览器中打开文件：
```
file:///Volumes/data/bitcard/bip39-vue/element-plus-vite-starter/docs/offline/index.html
```

**预期结果**：
- 页面顶部显示绿色的"离线版本"标签
- 不显示下载按钮
- 所有功能正常工作

### 2. 测试在线版本（本地）

使用开发服务器：
```bash
pnpm dev
```

然后访问 `http://localhost:5173`

**预期结果**：
- 页面顶部显示蓝色的"在线版本"标签
- 显示"下载离线版本"按钮
- 点击按钮可以下载离线版本

### 3. 测试在线版本（GitHub Pages）

部署到GitHub Pages后访问：
```
https://your-username.github.io/your-repo-name/
```

**预期结果**：
- 页面顶部显示蓝色的"在线版本"标签
- 显示"下载离线版本"按钮
- 点击按钮可以下载 `BIP39-SLIP39-Tool-Offline.html`

## 环境检测原理

代码通过检测 `window.location.protocol` 来判断：
- `file:` - 离线环境（直接打开HTML文件）
- `http:` 或 `https:` - 在线环境（通过Web服务器访问）

## 常见问题

### Q: 打开 dist/index.html 显示在线版本？
A: `dist` 文件夹已被删除。请使用 `docs/offline/index.html`

### Q: 离线版本功能不工作？
A: 确保使用最新构建的文件。运行 `pnpm build` 重新构建。

### Q: 下载按钮不工作？
A: 在本地开发环境中，需要确保 `docs/offline/index.html` 文件存在。
