# AetherDemo

一个基于 Vue 3 + Vite 的交互式画布演示项目。

## 项目技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **Canvas 绑定**: Vue-Konva + Konva.js
- **样式**: SCSS
- **代码规范**: ESLint + Prettier

## 项目结构

```
src/
├── api/           # API 接口定义
├── components/    # 公共组件
├── router/        # 路由配置
├── utils/         # 工具函数
├── views/         # 页面视图
│   └── canvas/    # 画布功能模块
├── App.vue        # 根组件
└── main.js        # 入口文件
```

## 功能特性

- 🎨 **交互式画布**: 基于 Konva.js 的画布绑定，支持局部重绘
- 📄 **多页面路由**: 首页、关于页、图像生成器、画布页面
- 📡 **API 集成**: Axios 封装的 HTTP 请求工具

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 许可证

MIT