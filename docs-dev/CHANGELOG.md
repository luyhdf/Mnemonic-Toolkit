# 文件整理记录

## 📅 整理日期
2025-01-17

## 📁 整理内容

### 移动的文件
以下文件已从项目根目录移动到 `docs-dev/` 文件夹：

1. **DEPLOY.md** → `docs-dev/DEPLOY.md`
   - GitHub Pages 部署指南
   - 在线版本和离线版本构建说明

2. **RENAME_INSTRUCTIONS.md** → `docs-dev/RENAME_INSTRUCTIONS.md`
   - 项目重命名说明（历史参考）
   - 从 element-plus-vite-starter 到 mnemonic-toolkit

3. **TEST_OFFLINE.md** → `docs-dev/TEST_OFFLINE.md`
   - 离线版本测试指南
   - 环境检测测试方法

4. **test-protocol.html** → `docs-dev/test-protocol.html`
   - 协议检测测试页面
   - 用于测试 file:// 和 http:// 协议检测

### 新增文件

1. **docs-dev/README.md**
   - 开发文档目录说明
   - 各文件用途介绍
   - 相关链接索引

2. **docs-dev/CHANGELOG.md** (本文件)
   - 文件整理记录
   - 整理原因说明

## 📝 整理原因

### 问题
项目根目录存在多个文档和测试文件，导致：
- 根目录文件过多，不够整洁
- 开发文档和生产代码混在一起
- 不利于项目维护和管理

### 解决方案
创建 `docs-dev/` 文件夹，将所有开发相关的文档和测试文件集中管理：
- ✅ 保持根目录整洁
- ✅ 开发文档集中管理
- ✅ 便于查找和维护
- ✅ 不影响生产构建

## 🔄 更新的文件

### README.md
- 更新了部署指南链接：`DEPLOY.md` → `docs-dev/DEPLOY.md`
- 添加了 `docs-dev/` 文件夹到项目结构说明
- 新增"开发文档"章节，包含所有开发相关文档的链接

## ✅ 验证结果

- ✅ 构建正常：`pnpm run build:online` 成功
- ✅ 文件已移动：所有文件已正确移动到 `docs-dev/`
- ✅ 文档已更新：README.md 链接已更新
- ✅ 目录结构清晰：根目录更加整洁

## 📂 当前项目结构

```
mnemonic-toolkit/
├── .github/              # GitHub Actions 配置
├── .kiro/                # Kiro 规范文档
│   └── specs/
│       └── bip39-tool/   # BIP39 工具规范
├── docs/                 # 生产构建输出（GitHub Pages）
├── docs-dev/             # 开发文档（新增）
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── DEPLOY.md
│   ├── TEST_OFFLINE.md
│   ├── RENAME_INSTRUCTIONS.md
│   └── test-protocol.html
├── src/                  # 源代码
├── public/               # 静态资源
├── README.md             # 项目主文档
├── package.json          # 项目配置
└── vite.config.ts        # Vite 配置
```

## 🎯 后续建议

1. **保持整洁**：新的开发文档应放在 `docs-dev/` 文件夹中
2. **定期更新**：当添加新文档时，更新 `docs-dev/README.md`
3. **版本控制**：确保 `docs-dev/` 文件夹被 Git 跟踪
4. **文档同步**：主 README.md 中的链接应指向 `docs-dev/` 中的文件

## 📌 注意事项

- `docs/` 文件夹用于生产构建输出，不要手动修改
- `docs-dev/` 文件夹用于开发文档，不会包含在生产构建中
- 所有开发相关的文档都应放在 `docs-dev/` 中
