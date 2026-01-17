# 项目重命名说明

## ✅ 已完成的更新

以下文件已更新为新名称 `mnemonic-toolkit`：

1. ✅ `package.json` - 项目名称和描述
2. ✅ `index.html` - 页面标题和元数据
3. ✅ `README.md` - 完整文档
4. ✅ `DEPLOY.md` - 部署文档

## 📁 重命名文件夹

请在终端执行以下命令来重命名项目文件夹：

```bash
# 1. 退出当前目录
cd ..

# 2. 重命名文件夹
mv element-plus-vite-starter mnemonic-toolkit

# 3. 进入新文件夹
cd mnemonic-toolkit

# 4. 验证
pwd
# 应该显示: /Volumes/data/bitcard/bip39-vue/mnemonic-toolkit
```

## 🔄 更新 Git 远程仓库（如果已有）

如果你已经将项目推送到 GitHub，需要更新仓库名称：

### 在 GitHub 上重命名仓库

1. 访问你的 GitHub 仓库
2. 点击 Settings
3. 在 Repository name 中输入 `mnemonic-toolkit`
4. 点击 Rename

### 更新本地 Git 配置

```bash
# 查看当前远程仓库
git remote -v

# 更新远程仓库 URL（替换 your-username）
git remote set-url origin https://github.com/your-username/mnemonic-toolkit.git

# 验证
git remote -v
```

## 🚀 重新构建

重命名后，建议重新构建项目：

```bash
# 清理旧的构建文件
rm -rf docs node_modules

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```

## ✨ 完成

重命名完成后，你的项目将使用新名称 `mnemonic-toolkit`！

访问地址将变为：
- 本地开发: `http://localhost:5173`
- GitHub Pages: `https://your-username.github.io/mnemonic-toolkit/`
