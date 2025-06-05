# 📷 图库协作项目 - SynoVision

## 项目简介

SynoVision 是一个图库协作平台，旨在为用户提供图片存储、管理和协作功能。无论是个人使用还是团队合作，用户都可以轻松上传、分类、分享和分析图片资源。

该项目是基于现代 Web 技术构建的前端应用，配合后端 API 实现完整的图库管理功能。

---

## 🔧 技术栈

### 前端技术

- **Vue.js**：采用 Vue 3 + TypeScript 构建现代化的前端架构。
- **TypeScript**：增强代码可维护性和类型安全性。
- **Vite**：快速构建工具，提供即时热更新体验。
- **Pinia**：用于全局状态管理（`stores` 目录）。
- **Vue Router**：实现单页应用中的导航与路由管理（`router/index.ts`）。
- **Axios/RESTful API**：通过封装 `request.ts` 和 `api` 目录中的控制器文件与后端通信。
- **ESLint**：代码规范工具，确保代码风格一致性。
- **Tailwind CSS 或自定义样式组件**：根据项目需求进行 UI 样式设计。

### 后端交互

- **健康检查**：通过 `/health` 接口验证服务可用性（`src/api/healthController.ts`）。
- **用户管理**：注册、登录、权限控制（`src/api/userController.ts`）。
- **空间管理**：支持创建和管理独立图库空间（`src/api/spaceController.ts`）。
- **图片管理**：上传、删除、查看图片详情（`src/api/pictureController.ts`）。
- **标签管理**：对图片进行标签分类（`src/api/tagController.ts`）。
- **成员管理**：在团队空间中添加或移除成员（`src/api/spaceMemberController.ts`）。
- **数据分析模块**：统计和分析图库使用情况（`src/api/spaceAnalyzeController.ts`）。

---

## 💡 项目亮点

### 1. 协作友好

- 支持多人共同管理图库空间，方便团队协作。
- 成员权限分级管理，保障数据安全。

### 2. 高性能架构

- 使用 Vite 提升开发速度，带来更快的热重载体验。
- 所有 API 请求经过统一封装，便于调试和错误处理。

### 3. 数据可视化

- 内置多维数据分析模块（如空间大小分析、图片类别分析等），帮助用户更好地了解图库使用情况。

### 4. 可扩展性强

- 模块化设计清晰，便于后续新增功能模块（如社区讨论、AI创建图片、AI 图片识别等）。

### 5. 完善的用户体验

- 提供图像裁剪、扩图等功能（如 `ImageCropper.vue` 和 `ImageOutPainting.vue`）。

### 6. 权限管理

- 强大的访问控制机制 (`access.ts`)，确保不同角色拥有合适的操作权限。

### 7. 开箱即用的工具链

- 包含 ESLint、TypeScript、Vite 等现代开发工具，开箱即用。



## 📁 项目结构概览

``` text
SynoVision-frontend/
├── src/                       # 核心源代码目录
│   ├── api/                   # 接口请求模块（如 userController.ts）
│   ├── components/            # Vue 可复用组件（如 PictureUpload.vue）
│   ├── constant/              # 常量定义（如 space.ts 和 picture.ts）
│   ├── layouts/               # 页面布局组件（如 BasicLayout.vue）
│   ├── pages/                 # 各个功能页面组件（如 SpaceDetailPage.vue）
│   ├── router/                # 路由配置（Vue Router 的 index.ts）
│   ├── stores/                # 状态管理模块（Pinia 存储）
│   ├── util/                  # 工具类函数（如 WebSocket 工具 PictureEditWs.ts）
│   ├── App.vue                # 根组件
│   ├── main.ts                # 入口文件
│   └── request.ts             # 封装的 HTTP 请求工具
│
├── public/                    # 静态资源目录（可选）
├── README.md                  # 项目说明文档
├── package.json               # 项目依赖及脚本配置
├── tsconfig.json              # TypeScript 配置文件
├── vite.config.ts             # Vite 构建配置
└── index.html                 # 主 HTML 文件
```


---

## 🚀 快速启动指南

1. 克隆仓库：

``` bash
git clone https://github.com/yourname/SynoVision-frontend.git
```

2. 安装依赖：

``` bash
npm install
```

3. 运行项目：

``` bash
npm run dev 
```

## 📬 联系我们

如有任何问题或建议，请提交 Issue 或 联系我的邮箱 [2439502320@qq.com]()。