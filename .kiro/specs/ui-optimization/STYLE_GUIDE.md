# UI样式指南

## 颜色系统

### 主色调
```scss
$primary: #667eea;        // 紫色 - 主要操作、品牌色
$primary-light: #8b9ef5;  // 浅紫色 - hover状态
$primary-dark: #4c5fd5;   // 深紫色 - active状态
```

### 功能色
```scss
$success: #67c23a;        // 绿色 - 成功、有效
$warning: #e6a23c;        // 橙色 - 警告、重要
$danger: #f56c6c;         // 红色 - 危险、删除
$info: #909399;           // 灰色 - 信息、次要
```

### 中性色
```scss
$text-primary: #303133;   // 主要文字
$text-regular: #606266;   // 常规文字
$text-secondary: #909399; // 次要文字
$text-placeholder: #c0c4cc; // 占位文字

$border-base: #dcdfe6;    // 基础边框
$border-light: #e4e7ed;   // 浅色边框
$border-lighter: #ebeef5; // 更浅边框

$bg-white: #ffffff;       // 白色背景
$bg-light: #f5f7fa;       // 浅色背景
$bg-lighter: #fafafa;     // 更浅背景
```

### 渐变色
```scss
$gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$gradient-success: linear-gradient(135deg, #67c23a 0%, #5daf34 100%);
$gradient-warning: linear-gradient(135deg, #e6a23c 0%, #d89614 100%);
```

## 间距系统

### 基础间距
```scss
$spacing-xs: 8px;   // 超小间距
$spacing-sm: 12px;  // 小间距
$spacing-md: 16px;  // 中等间距
$spacing-lg: 24px;  // 大间距
$spacing-xl: 32px;  // 超大间距
$spacing-xxl: 48px; // 特大间距
```

### 使用场景
- **xs (8px)**: 按钮内图标与文字间距、标签间距
- **sm (12px)**: 表单项内部间距、卡片内小元素间距
- **md (16px)**: 卡片内边距、表单项间距
- **lg (24px)**: 组件外边距、区块间距
- **xl (32px)**: 大区块间距、页面边距
- **xxl (48px)**: 页面主要区块间距

## 字体系统

### 字号
```scss
$font-size-h1: 24px;    // 主标题
$font-size-h2: 18px;    // 次标题
$font-size-h3: 16px;    // 三级标题
$font-size-base: 14px;  // 正文
$font-size-small: 12px; // 辅助文字
$font-size-mini: 10px;  // 极小文字
```

### 字重
```scss
$font-weight-bold: 600;    // 粗体 - 标题
$font-weight-medium: 500;  // 中等 - 强调
$font-weight-normal: 400;  // 常规 - 正文
$font-weight-light: 300;   // 细体 - 次要
```

### 行高
```scss
$line-height-base: 1.5;    // 正文行高
$line-height-heading: 1.2; // 标题行高
$line-height-tight: 1.3;   // 紧凑行高
```

## 圆角系统

```scss
$border-radius-sm: 4px;   // 小圆角 - 标签、徽章
$border-radius-base: 6px; // 基础圆角 - 按钮、输入框
$border-radius-md: 8px;   // 中等圆角 - 卡片
$border-radius-lg: 12px;  // 大圆角 - 大卡片
$border-radius-round: 50%; // 圆形 - 头像、徽章
```

## 阴影系统

```scss
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
$shadow-base: 0 2px 8px rgba(0, 0, 0, 0.12);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.18);

// 特殊阴影
$shadow-primary: 0 4px 12px rgba(102, 126, 234, 0.3);
$shadow-success: 0 2px 8px rgba(103, 194, 58, 0.2);
```

## 动画系统

### 过渡时间
```scss
$transition-fast: 0.15s;    // 快速 - 小元素
$transition-base: 0.3s;     // 基础 - 常规元素
$transition-slow: 0.5s;     // 慢速 - 大元素
```

### 缓动函数
```scss
$ease-in-out: ease-in-out;  // 标准缓动
$ease-out: ease-out;        // 减速
$ease-in: ease-in;          // 加速
```

### 常用过渡
```scss
$transition-all: all $transition-base $ease-in-out;
$transition-color: color $transition-base $ease-in-out;
$transition-bg: background-color $transition-base $ease-in-out;
$transition-border: border-color $transition-base $ease-in-out;
$transition-transform: transform $transition-base $ease-in-out;
```

## 响应式断点

```scss
// 移动端
$breakpoint-xs: 0;
$breakpoint-sm: 576px;

// 平板
$breakpoint-md: 768px;

// 桌面
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-xxl: 1920px;
```

### 媒体查询 Mixin
```scss
@mixin mobile {
  @media (max-width: #{$breakpoint-md - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$breakpoint-md}) and (max-width: #{$breakpoint-lg - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$breakpoint-lg}) {
    @content;
  }
}
```

## 组件样式规范

### 按钮
```scss
.el-button {
  // 基础样式
  border-radius: $border-radius-base;
  padding: 12px 20px;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  transition: $transition-all;
  
  // Hover状态
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }
  
  // 图标间距
  .el-icon {
    margin-right: $spacing-xs;
  }
}
```

### 卡片
```scss
.el-card {
  border-radius: $border-radius-md;
  border: 1px solid $border-light;
  box-shadow: $shadow-sm;
  transition: $transition-all;
  
  &:hover {
    box-shadow: $shadow-md;
  }
  
  .el-card__header {
    padding: $spacing-md;
    border-bottom: 1px solid $border-lighter;
  }
  
  .el-card__body {
    padding: $spacing-md;
  }
}
```

### 输入框
```scss
.el-input {
  .el-input__inner {
    border-radius: $border-radius-base;
    padding: 12px 15px;
    font-size: $font-size-base;
    transition: $transition-border;
    
    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }
}
```

### 网格布局
```scss
.mnemonic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: $spacing-sm;
  
  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xs;
  }
  
  @include tablet {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include desktop {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## 使用示例

### Header组件
```vue
<template>
  <div class="app-header">
    <div class="header-left">
      <h1 class="app-title">
        <el-icon><Key /></el-icon>
        助记词工具箱
      </h1>
      <el-tag size="small" :type="isOffline ? 'success' : 'info'">
        {{ isOffline ? '离线模式' : '在线模式' }}
      </el-tag>
    </div>
    <div class="header-right">
      <el-button type="primary" size="small">
        下载离线版
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  background: $gradient-primary;
  color: white;
  border-radius: $border-radius-md;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-primary;
  
  @include mobile {
    padding: $spacing-sm $spacing-md;
    flex-direction: column;
    gap: $spacing-sm;
  }
}

.app-title {
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  
  @include mobile {
    font-size: $font-size-h2;
  }
}
</style>
```

## 可访问性规范

### 颜色对比度
- 正文文字与背景对比度 ≥ 4.5:1
- 大文字（18px+）与背景对比度 ≥ 3:1
- 图标与背景对比度 ≥ 3:1

### 交互元素
- 最小点击区域：44x44px（移动端）
- 键盘可访问：所有交互元素支持Tab导航
- 焦点指示：清晰的焦点边框

### ARIA标签
```vue
<!-- 图标按钮 -->
<el-button icon="Delete" aria-label="删除助记词" />

<!-- 表单 -->
<el-form-item label="助记词" aria-describedby="mnemonic-help">
  <el-input />
  <div id="mnemonic-help">请输入12或24个单词</div>
</el-form-item>
```

## 最佳实践

1. **使用变量** - 所有颜色、间距、字体使用变量
2. **移动优先** - 先写移动端样式，再用媒体查询增强
3. **语义化** - 使用语义化的class名称
4. **模块化** - 组件样式使用scoped
5. **性能优化** - 使用transform代替position动画
6. **可维护性** - 保持样式简洁，避免过度嵌套
