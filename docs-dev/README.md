# 开发文档目录

本目录包含项目的开发相关文档和测试文件。

## 📁 文件说明

### 部署相关
- **DEPLOY.md** - GitHub Pages 部署指南
  - 在线版本和离线版本的构建说明
  - GitHub Actions 自动部署配置
  - 手动部署步骤
  - 常见问题解决方案

### 测试相关
- **TEST_OFFLINE.md** - 离线版本测试指南
  - 离线版本测试步骤
  - 环境检测原理说明
  - 常见问题排查

- **test-protocol.html** - 协议检测测试页面
  - 用于测试浏览器环境检测功能
  - 显示当前协议类型（file:// 或 http://）

### 项目管理
- **RENAME_INSTRUCTIONS.md** - 项目重命名说明
  - 项目从 element-plus-vite-starter 重命名为 mnemonic-toolkit 的步骤
  - Git 远程仓库更新方法
  - 历史参考文档

## 🔗 相关链接

- 主项目文档: [../README.md](../README.md)
- 规范文档: [../.kiro/specs/bip39-tool/](../.kiro/specs/bip39-tool/)
- 构建输出: [../docs/](../docs/)

## 📝 使用说明

这些文档主要供开发者和维护者使用，不会包含在生产构建中。

如需部署项目，请参考 [DEPLOY.md](./DEPLOY.md)。
