# BIP39/SLIP39 工具 - 规格文档更新总结

## 更新日期
2026-01-17

## 更新内容

### 1. 需求文档更新 (requirements.md)

#### 新增需求

**需求 9：单文件应用构建**
- 使用 vite-plugin-singlefile 生成单HTML文件
- 内联所有 JavaScript 和 CSS
- 包含所有必需的 polyfills
- 确保离线环境完全可用
- 文件大小控制在 5MB 以内

**需求 10：在线版本下载功能**
- 在线版本显示下载按钮
- 单文件版本隐藏下载按钮
- 通过 URL 路径检测运行模式
- 下载文件命名为 "BIP39-TOOL-Single.html"

**需求 16：构建和部署要求**
- 提供构建命令生成生产版本
- 单独命令构建单HTML文件
- 构建时优化代码大小和性能
- 支持 GitHub Pages 部署
- 包含版本信息和构建时间

#### 更新的需求

**需求 11-15**（原需求 10-14）
- 重新编号以适应新增需求
- 内容保持不变

**需求 13：性能要求**
- 新增：单HTML文件加载时间在3秒内

**需求 14：安全要求**
- 新增：不在生产环境控制台输出敏感信息

**需求 15：兼容性要求**
- 新增：单HTML文件包含所有必要的 polyfills

### 2. 任务文档更新 (tasks.md)

#### 新增任务

**任务 1：配置单文件构建环境**
- 1.1 安装 vite-plugin-singlefile 插件
- 1.2 更新 vite.config.ts 配置
- 1.3 添加构建脚本到 package.json
- 1.4 测试单文件构建

**任务 2：检查点 - 单文件构建完成**
- 验证离线功能
- 检查文件大小
- 确保所有功能正常

#### 重新编号的任务

- 原任务 1（文件操作）→ 任务 3
- 原任务 2（BIP39组件）→ 任务 4（已完成）
- 原任务 3（SLIP39组件）→ 任务 5（已完成）
- 原任务 4（检查点）→ 任务 6
- 原任务 5（Composables）→ 任务 7
- 原任务 6（错误处理）→ 任务 8
- 原任务 7（检查点）→ 任务 9
- 原任务 8（单元测试）→ 任务 10
- 原任务 9（属性测试）→ 任务 11
- 原任务 10（检查点）→ 任务 12
- 原任务 11（样式优化）→ 任务 13
- 原任务 12（最终检查点）→ 任务 14

#### 更新实现顺序

新的实现顺序建议：
1. **第一阶段**: 任务1（单文件构建）- 实现核心部署需求
2. **第二阶段**: 任务3（文件操作）- 补充核心缺失功能
3. **第三阶段**: 任务7（Composables）- 提取可复用逻辑
4. **第四阶段**: 任务8（错误处理）- 改善用户体验
5. **第五阶段**: 任务10-11（测试）- 确保代码质量
6. **第六阶段**: 任务13（样式优化）- 完善界面

## 关键技术点

### 单文件构建配置

需要在 `vite.config.ts` 中添加：

```typescript
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [
    // ... 其他插件
    viteSingleFile()
  ],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  }
})
```

### package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:single": "vite build --config vite.config.single.ts",
    "preview": "vite preview"
  }
}
```

## 下一步行动

1. **立即执行**：任务 1 - 配置单文件构建环境
2. **验证**：确保单HTML文件能在离线环境正常运行
3. **测试**：测试所有功能在单文件模式下的表现
4. **优化**：如果文件过大，考虑优化策略

## 注意事项

1. **文件大小**：单HTML文件可能较大（包含所有依赖），需要监控大小
2. **Polyfills**：确保 Buffer 和 crypto polyfills 正确打包
3. **测试**：单文件版本需要独立测试，不能假设与在线版本完全一致
4. **浏览器兼容性**：确保 polyfills 覆盖所有目标浏览器

## 相关文件

- `.kiro/specs/bip39-tool/requirements.md` - 需求文档
- `.kiro/specs/bip39-tool/design.md` - 设计文档（未修改）
- `.kiro/specs/bip39-tool/tasks.md` - 任务文档
- `vite.config.ts` - Vite 配置文件（待更新）
- `package.json` - 项目配置（待更新）
